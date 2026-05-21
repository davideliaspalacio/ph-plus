import { describe, expect, it, vi } from "vitest";
import { combineTotals, submitOrder } from "./totals";
import type { Coupon } from "@/src/features/coupons";
import type { ShippingZone } from "@/src/features/shipping";
import type { OrderRepository, Order } from "@/src/features/orders";

type P = { slug: string; priceValue: number; title: string };

const PRODUCTS: Record<string, P> = {
  "agua-1l": { slug: "agua-1l", priceValue: 5_000, title: "Agua 1L" },
  "agua-5l": { slug: "agua-5l", priceValue: 20_000, title: "Agua 5L" },
};

const lookup = (slug: string) => PRODUCTS[slug];

describe("combineTotals", () => {
  it("calcula subtotal/total sin cupón y sin zona", () => {
    const s = combineTotals({
      items: [{ slug: "agua-1l", quantity: 2 }],
      lookup,
    });
    expect(s.totals.subtotal).toBe(10_000);
    expect(s.totals.discount).toBe(0);
    expect(s.totals.couponReason).toBe("NO_COUPON");
    expect(s.lines).toHaveLength(1);
  });

  it("aplica descuento cuando el cupón es válido", () => {
    const coupon: Coupon = {
      id: "c1",
      code: "DESC10",
      type: "percent",
      value: 10,
      startsAt: "2020-01-01T00:00:00Z",
      endsAt: "2099-01-01T00:00:00Z",
      minSubtotal: 0,
      maxUses: 100,
      maxUsesPerCustomer: 10,
      usedCount: 0,
      isActive: true,
    };
    const s = combineTotals({
      items: [{ slug: "agua-5l", quantity: 1 }],
      lookup,
      coupon,
      now: new Date("2025-01-01T00:00:00Z"),
    });
    expect(s.totals.subtotal).toBe(20_000);
    expect(s.totals.discount).toBe(2_000);
    expect(s.totals.couponReason).toBe("OK");
  });

  it("usa la zona cuando se pasa city + zones", () => {
    const zones: ShippingZone[] = [
      {
        id: "z-bog",
        name: "Bogotá",
        regions: ["Bogotá"],
        cost: 6_000,
        leadTimeDaysMin: 1,
        leadTimeDaysMax: 2,
        isActive: true,
      },
    ];
    const s = combineTotals({
      items: [{ slug: "agua-1l", quantity: 1 }],
      lookup,
      shippingZones: zones,
      city: "Bogotá",
    });
    expect(s.totals.shipping).toBe(6_000);
    expect(s.totals.shippingZoneId).toBe("z-bog");
  });
});

describe("submitOrder", () => {
  function makeRepo(): OrderRepository {
    return {
      list: vi.fn(),
      byId: vi.fn(),
      byUser: vi.fn(),
      create: vi.fn(async (input) => {
        return {
          id: "ORD-1",
          status: input.status ?? "pending_payment",
          lines: input.lines,
          totals: input.totals,
          contact: input.contact,
          shipping: input.shipping,
          payment: input.payment,
          couponCode: input.couponCode,
          notes: [],
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
        } as Order;
      }),
      updateStatus: vi.fn(),
      addNote: vi.fn(),
      update: vi.fn(),
    };
  }

  it("crea un pedido con status pending_payment", async () => {
    const repo = makeRepo();
    const order = await submitOrder(
      {
        items: [{ slug: "agua-1l", quantity: 2 }],
        contact: {
          name: "Ana",
          email: "ana@y.com",
          phone: "3001234567",
        },
        shipping: {
          address: "Calle 1",
          city: "Bogotá",
          department: "Cundinamarca",
        },
        payment: { method: "pse" },
      },
      { orderRepo: repo, lookup },
    );
    expect(order.status).toBe("pending_payment");
    expect(order.lines).toHaveLength(1);
    expect(order.lines[0]).toMatchObject({
      slug: "agua-1l",
      title: "Agua 1L",
      quantity: 2,
      unitPrice: 5_000,
      lineTotal: 10_000,
    });
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it("persiste couponCode sólo si el cupón fue OK", async () => {
    const repo = makeRepo();
    const coupon: Coupon = {
      id: "c1",
      code: "DESC10",
      type: "percent",
      value: 10,
      startsAt: "2020-01-01T00:00:00Z",
      endsAt: "2099-01-01T00:00:00Z",
      minSubtotal: 0,
      maxUses: 100,
      maxUsesPerCustomer: 10,
      usedCount: 0,
      isActive: true,
    };
    const order = await submitOrder(
      {
        items: [{ slug: "agua-1l", quantity: 1 }],
        contact: { name: "Ana", email: "a@a.com", phone: "3001234567" },
        shipping: { address: "C 1", city: "Bogotá" },
        payment: { method: "pse" },
        coupon,
        now: new Date("2025-01-01T00:00:00Z"),
      },
      { orderRepo: repo, lookup },
    );
    expect(order.couponCode).toBe("DESC10");
    expect(order.totals.discount).toBe(500);
  });

  it("lanza error si el carrito queda vacío tras el lookup", async () => {
    const repo = makeRepo();
    await expect(
      submitOrder(
        {
          items: [{ slug: "no-existe", quantity: 1 }],
          contact: { name: "Ana", email: "a@a.com", phone: "3001234567" },
          shipping: { address: "C 1", city: "Bogotá" },
          payment: { method: "pse" },
        },
        { orderRepo: repo, lookup },
      ),
    ).rejects.toThrow("EMPTY_CART");
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("incluye last4 cuando method=credit_card y card4Last presente", async () => {
    const repo = makeRepo();
    const order = await submitOrder(
      {
        items: [{ slug: "agua-1l", quantity: 1 }],
        contact: { name: "Ana", email: "a@a.com", phone: "3001234567" },
        shipping: { address: "C 1", city: "Bogotá" },
        payment: { method: "credit_card", card4Last: "1234" },
      },
      { orderRepo: repo, lookup },
    );
    expect(order.payment.method).toBe("credit_card");
    expect(order.payment.last4).toBe("1234");
  });
});
