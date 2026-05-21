import { describe, expect, it } from "vitest";
import {
  OrderSchema,
  OrderStatusSchema,
  OrderLineSchema,
  OrderTotalsSchema,
  OrderContactSchema,
} from "./order";

/**
 * Tests del schema completo del pedido. Garantizan que las invariantes mínimas
 * (al menos una línea, contacto presente, estado dentro del enum) se respetan.
 */

const validOrder = {
  id: "ORD-ABC12345",
  userId: "user_1",
  status: "pending_payment" as const,
  lines: [
    {
      slug: "kit-x2",
      title: "Kit x2",
      quantity: 1,
      unitPrice: 30000,
      lineTotal: 30000,
    },
  ],
  totals: {
    subtotal: 30000,
    discount: 0,
    shipping: 8000,
    total: 38000,
  },
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+57 300 0000000",
  },
  shipping: {
    address: "Calle Falsa 123",
    city: "Bogotá",
    department: "Cundinamarca",
  },
  payment: { method: "mock" as const },
  notes: [],
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T10:00:00.000Z",
};

describe("OrderSchema", () => {
  it("acepta un pedido válido completo", () => {
    const parsed = OrderSchema.parse(validOrder);
    expect(parsed.id).toBe("ORD-ABC12345");
    expect(parsed.lines).toHaveLength(1);
  });

  it("acepta pedido sin userId (guest)", () => {
    const { userId: _omit, ...guest } = validOrder;
    void _omit;
    const parsed = OrderSchema.parse(guest);
    expect(parsed.userId).toBeUndefined();
  });

  it("rechaza pedido sin lines (array vacío)", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, lines: [] }),
    ).toThrow();
  });

  it("rechaza pedido sin contact", () => {
    const { contact: _omit, ...sinContacto } = validOrder;
    void _omit;
    expect(() => OrderSchema.parse(sinContacto)).toThrow();
  });

  it("rechaza status fuera del enum", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, status: "in_orbit" }),
    ).toThrow();
  });

  it("rechaza email de contacto inválido", () => {
    expect(() =>
      OrderSchema.parse({
        ...validOrder,
        contact: { ...validOrder.contact, email: "no-es-email" },
      }),
    ).toThrow();
  });
});

describe("Sub-schemas", () => {
  it("OrderStatusSchema acepta los 9 estados", () => {
    for (const s of [
      "draft",
      "pending_payment",
      "paid",
      "preparing",
      "shipped",
      "delivered",
      "closed",
      "cancelled",
      "refunded",
    ] as const) {
      expect(OrderStatusSchema.parse(s)).toBe(s);
    }
  });

  it("OrderLineSchema rechaza quantity = 0", () => {
    expect(() =>
      OrderLineSchema.parse({
        slug: "x",
        title: "X",
        quantity: 0,
        unitPrice: 100,
        lineTotal: 0,
      }),
    ).toThrow();
  });

  it("OrderTotalsSchema rechaza subtotal negativo", () => {
    expect(() =>
      OrderTotalsSchema.parse({
        subtotal: -1,
        discount: 0,
        shipping: 0,
        total: 0,
      }),
    ).toThrow();
  });

  it("OrderContactSchema requiere phone no vacío", () => {
    expect(() =>
      OrderContactSchema.parse({
        name: "Ada",
        email: "ada@x.com",
        phone: "",
      }),
    ).toThrow();
  });
});
