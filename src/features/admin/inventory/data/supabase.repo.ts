import {
  StockItemSchema,
  StockMovementSchema,
  type StockItem,
  type StockMovement,
} from "../domain/stock";
import { INSUFFICIENT_STOCK } from "../domain/compute";
import type {
  AdjustStockResult,
  InventoryRepository,
  NewStockMovementInput,
} from "./ports";

/**
 * Repo de inventario contra Supabase.
 *
 * Tablas:
 * - `public.stock_items` (pk = sku, snake_case)
 * - `public.stock_movements` (uuid, fk a stock_items.sku)
 *
 * `adjustStock` delega en la RPC `apply_stock_movement` que ya valida
 * `INSUFFICIENT_STOCK`, `INVALID_QUANTITY` y `SKU_NOT_FOUND` y actualiza stock
 * + crea el movement en una sola transacción. Re-leemos el movement recién
 * creado para devolverlo completo (la RPC sólo retorna el StockItem).
 *
 * `seedFromProducts` hace un upsert con `onConflict: "sku"` + `ignoreDuplicates`
 * para mantener idempotencia (si ya existe, no toca).
 */

interface StockItemDbRow {
  sku: string;
  product_slug: string;
  current: number;
  low: number;
  location: string | null;
  updated_at: string;
}

interface StockItemDbInsert {
  sku: string;
  product_slug: string;
  current: number;
  low: number;
  location?: string | null;
}

interface StockMovementDbRow {
  id: string;
  sku: string;
  type: StockMovement["type"];
  quantity: number;
  reason: StockMovement["reason"];
  note: string | null;
  author: string;
  created_at: string;
}

function mapStockRow(row: StockItemDbRow): StockItem {
  return StockItemSchema.parse({
    sku: row.sku,
    productSlug: row.product_slug,
    current: row.current,
    low: row.low,
    location: row.location ?? undefined,
  });
}

function mapMovementRow(row: StockMovementDbRow): StockMovement {
  return StockMovementSchema.parse({
    id: row.id,
    sku: row.sku,
    type: row.type,
    quantity: row.quantity,
    reason: row.reason,
    note: row.note ?? undefined,
    author: row.author,
    createdAt: row.created_at,
  });
}

function slugToSku(slug: string): string {
  return `SKU-${slug.toUpperCase()}`;
}

function randomInitialStock(): number {
  // 5..50 inclusive — mismo rango que el mock.
  return 5 + Math.floor(Math.random() * 46);
}

function defaultLowThreshold(): number {
  return 5;
}

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

/**
 * Traduce mensajes de error de la RPC a errores legibles consistentes con el
 * dominio. La RPC tira `INSUFFICIENT_STOCK`, `INVALID_QUANTITY`,
 * `SKU_NOT_FOUND:<sku>`.
 */
function translateRpcError(message: string, sku: string): Error {
  if (message.includes("INSUFFICIENT_STOCK")) {
    return new Error(INSUFFICIENT_STOCK);
  }
  if (message.includes("SKU_NOT_FOUND")) {
    return new Error(`Stock SKU ${sku} not found`);
  }
  if (message.includes("INVALID_QUANTITY")) {
    return new Error("INVALID_QUANTITY");
  }
  return new Error(`SupabaseInventoryRepo.adjustStock: ${message}`);
}

export class SupabaseInventoryRepo implements InventoryRepository {
  async listStock(): Promise<StockItem[]> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("stock_items")
      .select("*")
      .order("sku", { ascending: true });

    if (error) {
      throw new Error(`SupabaseInventoryRepo.listStock: ${error.message}`);
    }
    const rows = (data ?? []) as unknown as StockItemDbRow[];
    return rows.map(mapStockRow);
  }

  async getStock(sku: string): Promise<StockItem | null> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("stock_items")
      .select("*")
      .eq("sku", sku)
      .maybeSingle();

    if (error) {
      throw new Error(`SupabaseInventoryRepo.getStock: ${error.message}`);
    }
    if (!data) return null;
    return mapStockRow(data as unknown as StockItemDbRow);
  }

  async adjustStock(
    sku: string,
    movement: NewStockMovementInput,
  ): Promise<AdjustStockResult> {
    const supabase = await getClient();

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "apply_stock_movement",
      {
        p_sku: sku,
        p_type: movement.type,
        p_quantity: movement.quantity,
        p_reason: movement.reason,
        p_author: movement.author,
        p_note: movement.note,
      } as unknown as never,
    );

    if (rpcError) {
      throw translateRpcError(rpcError.message, sku);
    }
    if (!rpcData) {
      throw new Error(`SupabaseInventoryRepo.adjustStock: no data`);
    }

    const updatedStock = mapStockRow(rpcData as unknown as StockItemDbRow);

    // Releemos el movement recién insertado por (sku, author, type, quantity,
    // reason) ordenando por created_at desc. Es seguro: la RPC corre en una
    // transacción y siempre inserta el movement antes de devolver.
    const { data: movRow, error: movErr } = await supabase
      .from("stock_movements")
      .select("*")
      .eq("sku", sku)
      .eq("type", movement.type)
      .eq("quantity", movement.quantity)
      .eq("reason", movement.reason)
      .eq("author", movement.author)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (movErr) {
      throw new Error(
        `SupabaseInventoryRepo.adjustStock (read movement): ${movErr.message}`,
      );
    }
    if (!movRow) {
      throw new Error(
        `SupabaseInventoryRepo.adjustStock: movement row not found after RPC`,
      );
    }

    return {
      stock: updatedStock,
      movement: mapMovementRow(movRow as unknown as StockMovementDbRow),
    };
  }

  async listMovements(sku?: string): Promise<StockMovement[]> {
    const supabase = await getClient();
    let query = supabase
      .from("stock_movements")
      .select("*")
      .order("created_at", { ascending: false });

    if (sku) {
      query = query.eq("sku", sku);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(
        `SupabaseInventoryRepo.listMovements: ${error.message}`,
      );
    }
    const rows = (data ?? []) as unknown as StockMovementDbRow[];
    return rows.map(mapMovementRow);
  }

  async seedFromProducts(slugs: string[]): Promise<StockItem[]> {
    if (slugs.length === 0) return [];
    const supabase = await getClient();

    const rows: StockItemDbInsert[] = slugs.map((slug) => ({
      sku: slugToSku(slug),
      product_slug: slug,
      current: randomInitialStock(),
      low: defaultLowThreshold(),
    }));

    // `ignoreDuplicates` => si ya existe el SKU (pk), no lo pisa.
    const { error: upsertErr } = await supabase
      .from("stock_items")
      .upsert(rows as unknown as never, {
        onConflict: "sku",
        ignoreDuplicates: true,
      });

    if (upsertErr) {
      throw new Error(
        `SupabaseInventoryRepo.seedFromProducts: ${upsertErr.message}`,
      );
    }

    // Releemos el estado final de los SKUs requeridos.
    const skus = rows.map((r) => r.sku);
    const { data, error } = await supabase
      .from("stock_items")
      .select("*")
      .in("sku", skus);

    if (error) {
      throw new Error(
        `SupabaseInventoryRepo.seedFromProducts (read): ${error.message}`,
      );
    }
    const items = ((data ?? []) as unknown as StockItemDbRow[]).map(
      mapStockRow,
    );

    // Devolvemos en el mismo orden de entrada (filtrando los que no se hayan
    // creado por falta del producto al que referencian).
    const bySku = new Map(items.map((i) => [i.sku, i]));
    return rows.flatMap((r) => {
      const item = bySku.get(r.sku);
      return item ? [item] : [];
    });
  }
}
