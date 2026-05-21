/**
 * Máquina de estados de un pedido (Apéndice B del FUNCTIONAL-SPEC).
 *
 *   draft ──► pending_payment ──► paid ──► preparing ──► shipped ──► delivered ──► closed
 *     │             │              │           │            │            │
 *     └──cancel─────┴──cancel──────┴──refund───┴──refund────┴──return────┘
 *
 * - `draft`           → puede ir a `pending_payment` o `cancelled`.
 * - `pending_payment` → `paid` o `cancelled`.
 * - `paid`            → `preparing`, `cancelled` o `refunded`.
 * - `preparing`       → `shipped` o `refunded`.
 * - `shipped`         → `delivered` o `refunded`.
 * - `delivered`       → `closed` o `refunded` (return).
 * - `closed`, `cancelled`, `refunded` son estados terminales.
 *
 * `updateStatus` del repositorio usa `isValidTransition` para impedir saltos
 * inválidos (p.ej. `pending_payment → delivered`).
 */

import type { OrderStatus } from "./order";

export const ORDER_STATUSES = [
  "draft",
  "pending_payment",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "closed",
  "cancelled",
  "refunded",
] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_FLOW: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  draft: ["pending_payment", "cancelled"],
  pending_payment: ["paid", "cancelled"],
  paid: ["preparing", "cancelled", "refunded"],
  preparing: ["shipped", "refunded"],
  shipped: ["delivered", "refunded"],
  delivered: ["closed", "refunded"],
  closed: [],
  cancelled: [],
  refunded: [],
};

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_FLOW[from]?.includes(to) ?? false;
}
