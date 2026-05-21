import { describe, expect, it } from "vitest";
import { buildCustomerView } from "./compute";
import { VIP_THRESHOLD_COP } from "./customer-view";
import type { User } from "@/src/features/auth";
import type { Order, OrderStatus } from "@/src/features/orders";

const baseUser = (overrides: Partial<User> = {}): User => ({
  id: "u-1",
  email: "ana@example.com",
  name: "Ana Pérez",
  role: "customer",
  passwordHash: "salt:hash",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const baseOrder = (overrides: Partial<Order> = {}): Order => ({
  id: "ORD-0001",
  userId: "u-1",
  status: "paid" as OrderStatus,
  lines: [
    {
      slug: "x",
      title: "X",
      quantity: 1,
      unitPrice: 100_000,
      lineTotal: 100_000,
    },
  ],
  totals: {
    subtotal: 100_000,
    discount: 0,
    shipping: 0,
    total: 100_000,
  },
  contact: { name: "Ana", email: "ana@example.com", phone: "+57300" },
  shipping: { address: "Cll 1", city: "Bogotá", department: "Cundinamarca" },
  payment: { method: "credit_card" },
  notes: [],
  createdAt: "2026-02-01T10:00:00.000Z",
  updatedAt: "2026-02-01T10:00:00.000Z",
  ...overrides,
});

describe("buildCustomerView", () => {
  it("devuelve campos básicos cuando no hay pedidos", () => {
    const view = buildCustomerView(baseUser(), []);
    expect(view).toMatchObject({
      id: "u-1",
      name: "Ana Pérez",
      email: "ana@example.com",
      role: "customer",
      createdAt: "2026-01-01T00:00:00.000Z",
      ordersCount: 0,
      totalSpent: 0,
      lifetimeValue: 0,
      isVip: false,
    });
    expect(view.lastOrderAt).toBeUndefined();
  });

  it("suma totalSpent y cuenta pedidos excluyendo cancelled/refunded", () => {
    const orders: Order[] = [
      baseOrder({ id: "O1", status: "paid", totals: { subtotal: 100_000, discount: 0, shipping: 0, total: 100_000 } }),
      baseOrder({ id: "O2", status: "delivered", totals: { subtotal: 200_000, discount: 0, shipping: 0, total: 200_000 } }),
      baseOrder({ id: "O3", status: "cancelled", totals: { subtotal: 50_000, discount: 0, shipping: 0, total: 50_000 } }),
      baseOrder({ id: "O4", status: "refunded", totals: { subtotal: 30_000, discount: 0, shipping: 0, total: 30_000 } }),
    ];
    const view = buildCustomerView(baseUser(), orders);
    expect(view.ordersCount).toBe(2);
    expect(view.totalSpent).toBe(300_000);
    expect(view.lifetimeValue).toBe(300_000);
  });

  it("marca isVip cuando totalSpent >= umbral", () => {
    const orders: Order[] = [
      baseOrder({
        id: "O1",
        status: "paid",
        totals: { subtotal: VIP_THRESHOLD_COP, discount: 0, shipping: 0, total: VIP_THRESHOLD_COP },
      }),
    ];
    const view = buildCustomerView(baseUser(), orders);
    expect(view.isVip).toBe(true);
  });

  it("calcula lastOrderAt usando el pedido más reciente", () => {
    const orders: Order[] = [
      baseOrder({ id: "O1", createdAt: "2026-02-01T10:00:00.000Z" }),
      baseOrder({ id: "O2", createdAt: "2026-05-15T10:00:00.000Z" }),
      baseOrder({ id: "O3", createdAt: "2026-03-10T10:00:00.000Z" }),
    ];
    const view = buildCustomerView(baseUser(), orders);
    expect(view.lastOrderAt).toBe("2026-05-15T10:00:00.000Z");
  });
});
