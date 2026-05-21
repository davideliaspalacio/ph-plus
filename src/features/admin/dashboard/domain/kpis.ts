import type { Order, OrderStatus } from "@/src/features/orders";

/**
 * KPIs del dashboard admin.
 *
 * Funciones puras: reciben la lista de pedidos y devuelven los agregados que
 * la UI necesita para los cards/tablas. No tocan repos ni storage.
 *
 * Reglas:
 * - `totalSales` suma `totals.total` de los pedidos en rango EXCLUYENDO
 *   los estados `cancelled` y `refunded`. `totalOrders` y `ordersByStatus`
 *   sí los cuentan (para que el admin vea volumen total).
 * - `avgTicket` = `totalSales / totalOrders` (redondeado).
 * - `topProducts` ordena por `count` descendente.
 * - `from`/`to` son inclusivos. Si no se pasan, no filtra.
 */

export type TopProduct = {
  slug: string;
  title: string;
  count: number;
};

export type OrdersByStatus = Record<OrderStatus, number>;

export type Kpis = {
  totalSales: number;
  totalOrders: number;
  avgTicket: number;
  ordersByStatus: OrdersByStatus;
  topProducts: TopProduct[];
};

const ALL_STATUSES: OrderStatus[] = [
  "draft",
  "pending_payment",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "closed",
  "cancelled",
  "refunded",
];

function emptyByStatus(): OrdersByStatus {
  const out = {} as OrdersByStatus;
  for (const s of ALL_STATUSES) out[s] = 0;
  return out;
}

function inRange(order: Order, from?: Date, to?: Date): boolean {
  if (!from && !to) return true;
  const ts = new Date(order.createdAt).getTime();
  if (from && ts < from.getTime()) return false;
  if (to && ts > to.getTime()) return false;
  return true;
}

export function computeKpis(
  orders: Order[],
  from?: Date,
  to?: Date,
): Kpis {
  const filtered = orders.filter((o) => inRange(o, from, to));

  const ordersByStatus = emptyByStatus();
  let totalSales = 0;
  const productCounts = new Map<string, { title: string; count: number }>();

  for (const order of filtered) {
    ordersByStatus[order.status] += 1;
    if (order.status !== "cancelled" && order.status !== "refunded") {
      totalSales += order.totals.total;
    }

    for (const line of order.lines) {
      const prev = productCounts.get(line.slug);
      if (prev) {
        prev.count += line.quantity;
      } else {
        productCounts.set(line.slug, {
          title: line.title,
          count: line.quantity,
        });
      }
    }
  }

  const totalOrders = filtered.length;
  const avgTicket = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const topProducts: TopProduct[] = Array.from(productCounts.entries())
    .map(([slug, { title, count }]) => ({ slug, title, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalSales,
    totalOrders,
    avgTicket,
    ordersByStatus,
    topProducts,
  };
}
