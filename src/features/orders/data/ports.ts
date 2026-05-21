import type {
  Order,
  OrderContact,
  OrderInternalNote,
  OrderLine,
  OrderPayment,
  OrderShipping,
  OrderStatus,
  OrderTotals,
} from "../domain/order";

/**
 * Puerto del repositorio de pedidos.
 *
 * `mock.repo` lo cumple hoy con `localStorage`; mañana `supabase.repo` lo hará
 * contra la BD remota sin cambios en dominio ni UI.
 */

export type OrderFilters = {
  status?: OrderStatus;
  userId?: string;
};

/**
 * Input para crear un pedido: lo mínimo que la app conoce al cerrar el
 * checkout. El repo se encarga de asignar `id`, `createdAt`, `updatedAt`,
 * `status` por defecto y `notes` vacío.
 */
export type NewOrderInput = {
  userId?: string;
  status?: OrderStatus;
  lines: OrderLine[];
  totals: OrderTotals;
  contact: OrderContact;
  shipping: OrderShipping;
  payment: OrderPayment;
  couponCode?: string;
  trackingNumber?: string;
};

export type AddNoteInput = {
  author: string;
  text: string;
};

export interface OrderRepository {
  list(filters?: OrderFilters): Promise<Order[]>;
  byId(id: string): Promise<Order | null>;
  byUser(userId: string): Promise<Order[]>;
  create(input: NewOrderInput): Promise<Order>;
  updateStatus(id: string, next: OrderStatus): Promise<Order>;
  addNote(id: string, note: AddNoteInput): Promise<OrderInternalNote>;
  update(id: string, patch: Partial<Order>): Promise<Order>;
}
