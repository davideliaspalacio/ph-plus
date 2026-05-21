import { describe, expect, it } from "vitest";
import { computeKpis } from "./kpis";
import type { Order } from "@/src/features/orders";

function makeOrder(overrides: Partial<Order> & Pick<Order, "id">): Order {
  return {
    id: overrides.id,
    userId: overrides.userId,
    status: overrides.status ?? "paid",
    lines: overrides.lines ?? [
      {
        slug: "recarga-19lts-individual",
        title: "Recarga individual",
        quantity: 1,
        unitPrice: 30000,
        lineTotal: 30000,
      },
    ],
    totals: overrides.totals ?? {
      subtotal: 30000,
      discount: 0,
      shipping: 5000,
      total: 35000,
    },
    contact: overrides.contact ?? {
      name: "María",
      email: "maria@example.com",
      phone: "+57 300 000 0000",
    },
    shipping: overrides.shipping ?? {
      address: "Calle 1",
      city: "Bogotá",
      department: "Cundinamarca",
    },
    payment: overrides.payment ?? { method: "pse" },
    couponCode: overrides.couponCode,
    trackingNumber: overrides.trackingNumber,
    notes: overrides.notes ?? [],
    createdAt: overrides.createdAt ?? "2026-05-10T10:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-05-10T10:00:00.000Z",
  };
}

describe("computeKpis", () => {
  it("devuelve KPIs en cero cuando no hay pedidos", () => {
    const kpis = computeKpis([]);
    expect(kpis.totalSales).toBe(0);
    expect(kpis.totalOrders).toBe(0);
    expect(kpis.avgTicket).toBe(0);
    expect(kpis.topProducts).toEqual([]);
    expect(kpis.ordersByStatus.paid).toBe(0);
  });

  it("suma totales y cuenta pedidos (excluye cancelled/refunded de ventas)", () => {
    const orders = [
      makeOrder({ id: "1", status: "paid", totals: { subtotal: 100, discount: 0, shipping: 0, total: 100 } }),
      makeOrder({ id: "2", status: "delivered", totals: { subtotal: 200, discount: 0, shipping: 0, total: 200 } }),
      makeOrder({ id: "3", status: "cancelled", totals: { subtotal: 50, discount: 0, shipping: 0, total: 50 } }),
    ];
    const kpis = computeKpis(orders);
    expect(kpis.totalOrders).toBe(3);
    // 100 + 200 (cancelled 50 excluido de ventas).
    expect(kpis.totalSales).toBe(300);
    // avgTicket = totalSales / totalOrders = 300 / 3 = 100.
    expect(kpis.avgTicket).toBe(100);
  });

  it("agrupa pedidos por estado", () => {
    const orders = [
      makeOrder({ id: "1", status: "paid" }),
      makeOrder({ id: "2", status: "paid" }),
      makeOrder({ id: "3", status: "shipped" }),
    ];
    const kpis = computeKpis(orders);
    expect(kpis.ordersByStatus.paid).toBe(2);
    expect(kpis.ordersByStatus.shipped).toBe(1);
    expect(kpis.ordersByStatus.delivered).toBe(0);
  });

  it("calcula top productos por cantidad vendida", () => {
    const orders = [
      makeOrder({
        id: "1",
        lines: [
          { slug: "a", title: "A", quantity: 3, unitPrice: 100, lineTotal: 300 },
          { slug: "b", title: "B", quantity: 1, unitPrice: 100, lineTotal: 100 },
        ],
      }),
      makeOrder({
        id: "2",
        lines: [
          { slug: "a", title: "A", quantity: 2, unitPrice: 100, lineTotal: 200 },
        ],
      }),
    ];
    const kpis = computeKpis(orders);
    expect(kpis.topProducts[0]).toEqual({ slug: "a", title: "A", count: 5 });
    expect(kpis.topProducts[1]).toEqual({ slug: "b", title: "B", count: 1 });
  });

  it("filtra por rango de fechas (from/to inclusive)", () => {
    const orders = [
      makeOrder({ id: "1", createdAt: "2026-05-01T00:00:00.000Z", totals: { subtotal: 100, discount: 0, shipping: 0, total: 100 } }),
      makeOrder({ id: "2", createdAt: "2026-05-10T00:00:00.000Z", totals: { subtotal: 200, discount: 0, shipping: 0, total: 200 } }),
      makeOrder({ id: "3", createdAt: "2026-05-20T00:00:00.000Z", totals: { subtotal: 300, discount: 0, shipping: 0, total: 300 } }),
    ];
    const kpis = computeKpis(orders, new Date("2026-05-05"), new Date("2026-05-15"));
    expect(kpis.totalOrders).toBe(1);
    expect(kpis.totalSales).toBe(200);
  });
});
