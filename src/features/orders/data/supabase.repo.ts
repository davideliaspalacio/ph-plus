import { newOrderId } from "@/src/shared/lib/id";
import {
  OrderSchema,
  type Order,
  type OrderContact,
  type OrderInternalNote,
  type OrderLine,
  type OrderPayment,
  type OrderShipping,
  type OrderStatus,
  type OrderTotals,
} from "../domain/order";
import type {
  AddNoteInput,
  NewOrderInput,
  OrderFilters,
  OrderRepository,
} from "./ports";

/**
 * Repo de pedidos contra Supabase.
 *
 * El modelo es relacional:
 *   - `orders`        — cabecera + jsonb (contact, shipping, payment, totals)
 *   - `order_lines`   — líneas (uno-a-muchos)
 *   - `order_notes`   — notas internas (uno-a-muchos)
 *
 * El id de pedido se genera client-side (`newOrderId()`) y se manda con el
 * insert para preservar el prefijo `ORD-` (la función `new_order_id()` del DB
 * también lo soportaría, pero ahorramos un round-trip de RPC).
 *
 * La transición de estado la valida un trigger (`enforce_order_status_transition`)
 * que tira `INVALID_TRANSITION:from->to`. Acá detectamos ese mensaje y lo
 * re-lanzamos sin modificación para que la UI lo parseé igual que con el mock.
 */

interface OrderHeaderRow {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  contact: unknown;
  shipping: unknown;
  payment: unknown;
  totals: unknown;
  coupon_code: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderLineRow {
  id: string;
  order_id: string;
  slug: string;
  title: string;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
  created_at: string;
}

interface OrderNoteRow {
  id: string;
  order_id: string;
  author: string;
  text: string;
  created_at: string;
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

function mapLineRow(row: OrderLineRow): OrderLine {
  return {
    slug: row.slug,
    title: row.title,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    lineTotal: Number(row.line_total),
  };
}

function mapNoteRow(row: OrderNoteRow): OrderInternalNote {
  return {
    id: row.id,
    author: row.author,
    text: row.text,
    createdAt: row.created_at,
  };
}

function mapHeaderToOrder(
  header: OrderHeaderRow,
  lines: OrderLine[],
  notes: OrderInternalNote[],
): Order {
  return OrderSchema.parse({
    id: header.id,
    userId: header.user_id ?? undefined,
    status: header.status,
    lines,
    totals: header.totals as OrderTotals,
    contact: header.contact as OrderContact,
    shipping: header.shipping as OrderShipping,
    payment: header.payment as OrderPayment,
    couponCode: header.coupon_code ?? undefined,
    trackingNumber: header.tracking_number ?? undefined,
    notes,
    createdAt: header.created_at,
    updatedAt: header.updated_at,
  });
}

async function loadFullOrder(
  client: Awaited<ReturnType<typeof getClient>>,
  id: string,
): Promise<Order | null> {
  const { data: header, error: headerError } = await client
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (headerError) {
    throw new Error(`SupabaseOrderRepo.loadFullOrder: ${headerError.message}`);
  }
  if (!header) return null;

  const [{ data: lineRows, error: linesError }, { data: noteRows, error: notesError }] =
    await Promise.all([
      client
        .from("order_lines")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: true }),
      client
        .from("order_notes")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: true }),
    ]);

  if (linesError) {
    throw new Error(`SupabaseOrderRepo.loadFullOrder(lines): ${linesError.message}`);
  }
  if (notesError) {
    throw new Error(`SupabaseOrderRepo.loadFullOrder(notes): ${notesError.message}`);
  }

  const lines = ((lineRows ?? []) as unknown as OrderLineRow[]).map(mapLineRow);
  const notes = ((noteRows ?? []) as unknown as OrderNoteRow[]).map(mapNoteRow);

  return mapHeaderToOrder(header as unknown as OrderHeaderRow, lines, notes);
}

async function loadOrdersBatch(
  client: Awaited<ReturnType<typeof getClient>>,
  headers: OrderHeaderRow[],
): Promise<Order[]> {
  if (headers.length === 0) return [];
  const ids = headers.map((h) => h.id);

  const [{ data: lineRows, error: linesError }, { data: noteRows, error: notesError }] =
    await Promise.all([
      client.from("order_lines").select("*").in("order_id", ids),
      client.from("order_notes").select("*").in("order_id", ids),
    ]);

  if (linesError) {
    throw new Error(`SupabaseOrderRepo.batch(lines): ${linesError.message}`);
  }
  if (notesError) {
    throw new Error(`SupabaseOrderRepo.batch(notes): ${notesError.message}`);
  }

  const lines = (lineRows ?? []) as unknown as OrderLineRow[];
  const notes = (noteRows ?? []) as unknown as OrderNoteRow[];

  const linesByOrder = new Map<string, OrderLine[]>();
  for (const l of lines) {
    const list = linesByOrder.get(l.order_id) ?? [];
    list.push(mapLineRow(l));
    linesByOrder.set(l.order_id, list);
  }

  const notesByOrder = new Map<string, OrderInternalNote[]>();
  for (const n of notes) {
    const list = notesByOrder.get(n.order_id) ?? [];
    list.push(mapNoteRow(n));
    notesByOrder.set(n.order_id, list);
  }

  return headers.map((h) =>
    mapHeaderToOrder(
      h,
      linesByOrder.get(h.id) ?? [],
      notesByOrder.get(h.id) ?? [],
    ),
  );
}

export class SupabaseOrderRepo implements OrderRepository {
  async list(filters?: OrderFilters): Promise<Order[]> {
    const supabase = await getClient();
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.userId) query = query.eq("user_id", filters.userId);

    const { data, error } = await query;
    if (error) {
      throw new Error(`SupabaseOrderRepo.list: ${error.message}`);
    }
    const headers = (data ?? []) as unknown as OrderHeaderRow[];
    return loadOrdersBatch(supabase, headers);
  }

  async byId(id: string): Promise<Order | null> {
    const supabase = await getClient();
    return loadFullOrder(supabase, id);
  }

  async byUser(userId: string): Promise<Order[]> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`SupabaseOrderRepo.byUser: ${error.message}`);
    }
    const headers = (data ?? []) as unknown as OrderHeaderRow[];
    return loadOrdersBatch(supabase, headers);
  }

  async create(input: NewOrderInput): Promise<Order> {
    const supabase = await getClient();
    const id = newOrderId();

    const insertPayload = {
      id,
      user_id: input.userId ?? null,
      status: input.status ?? "pending_payment",
      contact: input.contact,
      shipping: input.shipping,
      payment: input.payment,
      totals: input.totals,
      coupon_code: input.couponCode ?? null,
      tracking_number: input.trackingNumber ?? null,
    };

    const { error: headerError } = await supabase
      .from("orders")
      .insert(insertPayload as never);

    if (headerError) {
      throw new Error(`SupabaseOrderRepo.create(header): ${headerError.message}`);
    }

    const linesPayload = input.lines.map((l) => ({
      order_id: id,
      slug: l.slug,
      title: l.title,
      quantity: l.quantity,
      unit_price: l.unitPrice,
      line_total: l.lineTotal,
    }));

    const { error: linesError } = await supabase
      .from("order_lines")
      .insert(linesPayload as never);

    if (linesError) {
      throw new Error(`SupabaseOrderRepo.create(lines): ${linesError.message}`);
    }

    const order = await loadFullOrder(supabase, id);
    if (!order) {
      throw new Error(`SupabaseOrderRepo.create: created order ${id} not found`);
    }
    return order;
  }

  async updateStatus(id: string, next: OrderStatus): Promise<Order> {
    const supabase = await getClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: next } as never)
      .eq("id", id);

    if (error) {
      // El trigger del DB tira mensajes tipo "INVALID_TRANSITION:from->to".
      // Los re-lanzamos tal cual para que la UI los parseé igual que en mock.
      throw new Error(error.message);
    }

    const order = await loadFullOrder(supabase, id);
    if (!order) throw new Error(`Order ${id} not found`);
    return order;
  }

  async addNote(id: string, note: AddNoteInput): Promise<OrderInternalNote> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("order_notes")
      .insert({
        order_id: id,
        author: note.author,
        text: note.text,
      } as never)
      .select("*")
      .single();

    if (error) {
      throw new Error(`SupabaseOrderRepo.addNote: ${error.message}`);
    }
    return mapNoteRow(data as unknown as OrderNoteRow);
  }

  async update(id: string, patch: Partial<Order>): Promise<Order> {
    const supabase = await getClient();
    const payload: Record<string, unknown> = {};

    if (patch.userId !== undefined) payload.user_id = patch.userId ?? null;
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.contact !== undefined) payload.contact = patch.contact;
    if (patch.shipping !== undefined) payload.shipping = patch.shipping;
    if (patch.payment !== undefined) payload.payment = patch.payment;
    if (patch.totals !== undefined) payload.totals = patch.totals;
    if (patch.couponCode !== undefined) {
      payload.coupon_code = patch.couponCode ?? null;
    }
    if (patch.trackingNumber !== undefined) {
      payload.tracking_number = patch.trackingNumber ?? null;
    }

    if (Object.keys(payload).length > 0) {
      const { error } = await supabase
        .from("orders")
        .update(payload as never)
        .eq("id", id);

      if (error) {
        throw new Error(`SupabaseOrderRepo.update: ${error.message}`);
      }
    }

    const order = await loadFullOrder(supabase, id);
    if (!order) throw new Error(`Order ${id} not found`);
    return order;
  }
}
