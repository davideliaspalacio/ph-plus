import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId, newOrderId } from "@/src/shared/lib/id";
import {
  OrderSchema,
  type Order,
  type OrderInternalNote,
  type OrderStatus,
} from "../domain/order";
import { isValidTransition } from "../domain/status";
import type {
  AddNoteInput,
  NewOrderInput,
  OrderFilters,
  OrderRepository,
} from "./ports";

/**
 * Implementación mock del `OrderRepository`.
 *
 * Persiste cada pedido como un item separado bajo el namespace
 * `phplus.db.orders.v1`, vía `makeNamespacedStorage`. No siembra datos: el
 * dataset arranca vacío y se llena con los pedidos que se vayan creando desde
 * el checkout / admin.
 *
 * `updateStatus` consulta `isValidTransition` y tira un error con código
 * `INVALID_TRANSITION:from->to` si la transición no está permitida por la
 * máquina de estados.
 */

export const ORDERS_NAMESPACE = "phplus.db.orders.v1";

const ns = makeNamespacedStorage<Order>(ORDERS_NAMESPACE);

function nowIso(): string {
  return new Date().toISOString();
}

function matches(order: Order, filters: OrderFilters | undefined): boolean {
  if (!filters) return true;
  if (filters.status && order.status !== filters.status) return false;
  if (filters.userId && order.userId !== filters.userId) return false;
  return true;
}

export class MockOrderRepo implements OrderRepository {
  async list(filters?: OrderFilters): Promise<Order[]> {
    return ns.list().filter((o) => matches(o, filters));
  }

  async byId(id: string): Promise<Order | null> {
    return ns.get(id) ?? null;
  }

  async byUser(userId: string): Promise<Order[]> {
    return ns.list().filter((o) => o.userId === userId);
  }

  async create(input: NewOrderInput): Promise<Order> {
    const now = nowIso();
    const order = OrderSchema.parse({
      id: newOrderId(),
      userId: input.userId,
      status: input.status ?? "pending_payment",
      lines: input.lines,
      totals: input.totals,
      contact: input.contact,
      shipping: input.shipping,
      payment: input.payment,
      couponCode: input.couponCode,
      trackingNumber: input.trackingNumber,
      notes: [],
      createdAt: now,
      updatedAt: now,
    });
    ns.set(order.id, order);
    return order;
  }

  async updateStatus(id: string, next: OrderStatus): Promise<Order> {
    const current = ns.get(id);
    if (!current) throw new Error(`Order ${id} not found`);
    if (!isValidTransition(current.status, next)) {
      throw new Error(`INVALID_TRANSITION:${current.status}->${next}`);
    }
    const updated = OrderSchema.parse({
      ...current,
      status: next,
      updatedAt: nowIso(),
    });
    ns.set(id, updated);
    return updated;
  }

  async addNote(id: string, note: AddNoteInput): Promise<OrderInternalNote> {
    const current = ns.get(id);
    if (!current) throw new Error(`Order ${id} not found`);
    const newNote: OrderInternalNote = {
      id: newId(),
      author: note.author,
      text: note.text,
      createdAt: nowIso(),
    };
    const updated = OrderSchema.parse({
      ...current,
      notes: [...current.notes, newNote],
      updatedAt: nowIso(),
    });
    ns.set(id, updated);
    return newNote;
  }

  async update(id: string, patch: Partial<Order>): Promise<Order> {
    const current = ns.get(id);
    if (!current) throw new Error(`Order ${id} not found`);
    const updated = OrderSchema.parse({
      ...current,
      ...patch,
      id: current.id,
      updatedAt: nowIso(),
    });
    ns.set(id, updated);
    return updated;
  }
}
