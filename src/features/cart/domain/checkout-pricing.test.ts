import { describe, expect, it } from "vitest";
import type { Coupon } from "@/src/features/coupons";
import type { ShippingZone } from "@/src/features/shipping";
import {
  SHIPPING_FLAT,
  type CartItemInput,
  type ProductLike,
} from "./pricing";
import { computeCheckoutPricing } from "./checkout-pricing";

const p = (slug: string, price: number): ProductLike => ({
  slug,
  priceValue: price,
});

const catalog: ProductLike[] = [
  p("agua-1l", 5_000),
  p("agua-5l", 18_000),
  p("botellon-19l", 36_000),
  p("kit-dispensador", 280_000),
];

const findBySlug = (slug: string) => catalog.find((c) => c.slug === slug);

const NOW = new Date("2026-05-20T12:00:00.000Z");

const baseCoupon = (overrides: Partial<Coupon> = {}): Coupon => ({
  id: "c1",
  code: "PROMO",
  type: "percent",
  value: 10,
  startsAt: "2026-01-01T00:00:00.000Z",
  endsAt: "2026-12-31T23:59:59.000Z",
  minSubtotal: 0,
  maxUses: 1000,
  maxUsesPerCustomer: 10,
  usedCount: 0,
  isActive: true,
  ...overrides,
});

const zone = (overrides: Partial<ShippingZone> = {}): ShippingZone => ({
  id: "z-bog",
  name: "Bogotá",
  regions: ["Bogotá"],
  cost: 12_000,
  leadTimeDaysMin: 1,
  leadTimeDaysMax: 2,
  isActive: true,
  ...overrides,
});

describe("computeCheckoutPricing", () => {
  it("sin coupon ni zona refleja los mismos números que buildCartSummary", () => {
    const items: CartItemInput[] = [
      { slug: "agua-1l", quantity: 2 }, // 10_000
      { slug: "agua-5l", quantity: 1 }, // 18_000
    ];
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      now: NOW,
    });

    expect(result.subtotal).toBe(28_000);
    expect(result.discount).toBe(0);
    expect(result.couponReason).toBe("NO_COUPON");
    expect(result.shippingCost).toBe(SHIPPING_FLAT);
    expect(result.shippingZoneId).toBeNull();
    expect(result.shippingFreeApplied).toBe(false);
    expect(result.total).toBe(28_000 + SHIPPING_FLAT);
    expect(result.totalItems).toBe(3);
    expect(result.lines).toHaveLength(2);
    expect(result.qualifiesForFreeShipping).toBe(false);
  });

  it("coupon percent OK descuenta el porcentaje del subtotal", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 2 }]; // 36_000
    const coupon = baseCoupon({ type: "percent", value: 10 });
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      coupon,
      now: NOW,
    });

    expect(result.subtotal).toBe(36_000);
    expect(result.discount).toBe(3_600);
    expect(result.couponReason).toBe("OK");
    expect(result.shippingCost).toBe(SHIPPING_FLAT);
    expect(result.total).toBe(36_000 - 3_600 + SHIPPING_FLAT);
  });

  it("coupon fixed OK descuenta un monto fijo", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 2 }]; // 36_000
    const coupon = baseCoupon({ type: "fixed", value: 5_000 });
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      coupon,
      now: NOW,
    });

    expect(result.discount).toBe(5_000);
    expect(result.couponReason).toBe("OK");
    expect(result.total).toBe(36_000 - 5_000 + SHIPPING_FLAT);
  });

  it("coupon free_shipping OK no elimina el costo de envío", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 2 }]; // 36_000
    const coupon = baseCoupon({ type: "free_shipping", value: 0 });
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      coupon,
      shippingZones: [zone({ cost: 15_000 })],
      city: "Bogotá",
      now: NOW,
    });

    expect(result.discount).toBe(0);
    expect(result.shippingCost).toBe(15_000);
    expect(result.shippingFreeApplied).toBe(false);
    expect(result.shippingZoneId).toBe("z-bog");
    expect(result.couponReason).toBe("OK");
    expect(result.total).toBe(36_000 + 15_000);
  });

  it("coupon vencido → discount=0, couponReason='EXPIRED'", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 1 }];
    const coupon = baseCoupon({
      endsAt: "2026-01-02T00:00:00.000Z",
    });
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      coupon,
      now: NOW,
    });

    expect(result.discount).toBe(0);
    expect(result.couponReason).toBe("EXPIRED");
  });

  it("coupon con minSubtotal no alcanzado → 'MIN_SUBTOTAL_NOT_REACHED'", () => {
    const items: CartItemInput[] = [{ slug: "agua-1l", quantity: 1 }]; // 5_000
    const coupon = baseCoupon({ minSubtotal: 50_000 });
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      coupon,
      now: NOW,
    });

    expect(result.discount).toBe(0);
    expect(result.couponReason).toBe("MIN_SUBTOTAL_NOT_REACHED");
  });

  it("shipping zone match → usa cost de la zona", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 2 }]; // 36_000
    const zones = [zone({ cost: 15_000 })];
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      shippingZones: zones,
      city: "bogota", // sin tilde + lower
      now: NOW,
    });

    expect(result.shippingCost).toBe(15_000);
    expect(result.shippingZoneId).toBe("z-bog");
    expect(result.shippingFreeApplied).toBe(false);
    expect(result.total).toBe(36_000 + 15_000);
  });

  it("shipping zone cobra aunque exista umbral de zona", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 2 }]; // 36_000
    const zones = [zone({ cost: 15_000, freeShippingThreshold: 30_000 })];
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      shippingZones: zones,
      city: "Bogotá",
      now: NOW,
    });

    expect(result.shippingCost).toBe(15_000);
    expect(result.shippingZoneId).toBe("z-bog");
    expect(result.shippingFreeApplied).toBe(false);
    expect(result.total).toBe(36_000 + 15_000);
  });

  it("shipping sin match de ciudad → fallback flat del pricing simple", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 1 }]; // 18_000
    const zones = [zone({ regions: ["Medellín"] })];
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      shippingZones: zones,
      city: "Cali",
      now: NOW,
    });

    expect(result.shippingCost).toBe(SHIPPING_FLAT);
    expect(result.shippingZoneId).toBeNull();
    expect(result.shippingFreeApplied).toBe(false);
  });

  it("coupon free_shipping no prevalece sobre cost de zona", () => {
    const items: CartItemInput[] = [{ slug: "kit-dispensador", quantity: 1 }];
    const coupon = baseCoupon({ type: "free_shipping", value: 0 });
    const zones = [zone({ cost: 25_000 })];
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      coupon,
      shippingZones: zones,
      city: "Bogotá",
      now: NOW,
    });

    expect(result.shippingCost).toBe(25_000);
    expect(result.shippingFreeApplied).toBe(false);
    expect(result.shippingZoneId).toBe("z-bog");
    expect(result.couponReason).toBe("OK");
    expect(result.total).toBe(280_000 + 25_000);
  });

  it("fallback flat cuando hay sólo zonas pero falta city", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 1 }];
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      shippingZones: [zone()],
      now: NOW,
    });

    expect(result.shippingCost).toBe(SHIPPING_FLAT);
    expect(result.shippingZoneId).toBeNull();
  });

  it("no marca envío gratis por umbral fallback", () => {
    const items: CartItemInput[] = [{ slug: "kit-dispensador", quantity: 1 }]; // 280_000
    const result = computeCheckoutPricing({
      items,
      lookup: findBySlug,
      now: NOW,
    });
    expect(result.qualifiesForFreeShipping).toBe(false);
  });
});
