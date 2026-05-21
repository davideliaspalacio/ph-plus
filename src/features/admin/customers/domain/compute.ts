/**
 * Construye la vista derivada `CustomerView` a partir de un `User` y la lista
 * de sus pedidos.
 *
 * - `totalSpent` ignora pedidos en estado `cancelled` o `refunded`.
 * - `ordersCount` también excluye esos mismos estados (cuenta de pedidos que
 *   sí representan ingreso real).
 * - `lifetimeValue` por ahora es igual a `totalSpent` (no calculamos margen).
 * - `lastOrderAt` toma el `createdAt` más reciente, considerando todos los
 *   pedidos del cliente (incluso cancelados, que igual son "actividad").
 */

import type { User } from "@/src/features/auth";
import type { Order, OrderStatus } from "@/src/features/orders";
import { VIP_THRESHOLD_COP, type CustomerView } from "./customer-view";

const NON_REVENUE_STATUSES = new Set<OrderStatus>(["cancelled", "refunded"]);

function countsForRevenue(order: Order): boolean {
  return !NON_REVENUE_STATUSES.has(order.status);
}

export function buildCustomerView(user: User, orders: Order[]): CustomerView {
  const revenueOrders = orders.filter(countsForRevenue);
  const totalSpent = revenueOrders.reduce(
    (acc, o) => acc + o.totals.total,
    0,
  );

  let lastOrderAt: string | undefined;
  for (const o of orders) {
    if (!lastOrderAt || o.createdAt > lastOrderAt) {
      lastOrderAt = o.createdAt;
    }
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    ordersCount: revenueOrders.length,
    totalSpent,
    lifetimeValue: totalSpent,
    lastOrderAt,
    isVip: totalSpent >= VIP_THRESHOLD_COP,
  };
}
