import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import {
  StockItemSchema,
  StockMovementSchema,
  type StockItem,
  type StockMovement,
} from "../domain/stock";
import { applyMovement } from "../domain/compute";
import type {
  AdjustStockResult,
  InventoryRepository,
  NewStockMovementInput,
} from "./ports";

/**
 * Implementación mock del InventoryRepository.
 *
 * Persiste en dos tablas separadas en `localStorage`:
 * - `phplus.db.inventory.stock.v1`     → un item por SKU (key = sku).
 * - `phplus.db.inventory.movements.v1` → un movimiento por id (key = id).
 *
 * El día que migremos a Supabase, estas dos tablas son dos tablas SQL
 * (`inventory_stock` y `inventory_movements`) y el contrato sigue igual.
 */

export const INVENTORY_STOCK_NAMESPACE = "phplus.db.inventory.stock.v1";
export const INVENTORY_MOVEMENTS_NAMESPACE =
  "phplus.db.inventory.movements.v1";

const stockNs = makeNamespacedStorage<StockItem>(INVENTORY_STOCK_NAMESPACE);
const movementsNs = makeNamespacedStorage<StockMovement>(
  INVENTORY_MOVEMENTS_NAMESPACE,
);

function randomInitialStock(): number {
  // 5..50 inclusive.
  return 5 + Math.floor(Math.random() * 46);
}

function slugToSku(slug: string): string {
  return `SKU-${slug.toUpperCase()}`;
}

function defaultLowThreshold(): number {
  return 5;
}

export class MockInventoryRepo implements InventoryRepository {
  async listStock(): Promise<StockItem[]> {
    return stockNs.list();
  }

  async getStock(sku: string): Promise<StockItem | null> {
    return stockNs.get(sku);
  }

  async adjustStock(
    sku: string,
    movement: NewStockMovementInput,
  ): Promise<AdjustStockResult> {
    const current = stockNs.get(sku);
    if (!current) throw new Error(`Stock SKU ${sku} not found`);

    const nextQty = applyMovement(current.current, {
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
    });

    const updatedStock = StockItemSchema.parse({
      ...current,
      current: nextQty,
    });
    stockNs.set(sku, updatedStock);

    const fullMovement = StockMovementSchema.parse({
      ...movement,
      sku,
      id: newId(),
      createdAt: new Date().toISOString(),
    });
    movementsNs.set(fullMovement.id, fullMovement);

    return { stock: updatedStock, movement: fullMovement };
  }

  async listMovements(sku?: string): Promise<StockMovement[]> {
    const all = movementsNs.list();
    const filtered = sku ? all.filter((m) => m.sku === sku) : all;
    return filtered.sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async seedFromProducts(slugs: string[]): Promise<StockItem[]> {
    const created: StockItem[] = [];
    for (const slug of slugs) {
      const sku = slugToSku(slug);
      const existing = stockNs.get(sku);
      if (existing) {
        created.push(existing);
        continue;
      }
      const item = StockItemSchema.parse({
        sku,
        productSlug: slug,
        current: randomInitialStock(),
        low: defaultLowThreshold(),
      });
      stockNs.set(sku, item);
      created.push(item);
    }
    return created;
  }
}
