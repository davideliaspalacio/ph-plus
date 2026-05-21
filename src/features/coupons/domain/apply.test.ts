import { describe, expect, it } from "vitest";
import { validateCoupon, computeDiscount } from "./apply";
import type { Coupon } from "./coupon";

/**
 * Tests de validateCoupon (gating) y computeDiscount (cálculo del descuento).
 */

function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    id: "c1",
    code: "BIENVENIDA10",
    type: "percent",
    value: 10,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    minSubtotal: 0,
    maxUses: 100,
    maxUsesPerCustomer: 1,
    usedCount: 0,
    isActive: true,
    ...overrides,
  };
}

describe("validateCoupon", () => {
  const ctx = {
    now: new Date("2026-06-01T00:00:00.000Z"),
    subtotal: 100_000,
  };

  it("devuelve ok cuando el cupón está activo y dentro de los límites", () => {
    const r = validateCoupon(makeCoupon(), ctx);
    expect(r.ok).toBe(true);
  });

  it("NOT_STARTED si now < startsAt", () => {
    const r = validateCoupon(
      makeCoupon({ startsAt: "2027-01-01T00:00:00.000Z" }),
      ctx,
    );
    expect(r).toEqual({ ok: false, reason: "NOT_STARTED" });
  });

  it("EXPIRED si now > endsAt", () => {
    const r = validateCoupon(
      makeCoupon({ endsAt: "2026-01-01T00:00:00.000Z" }),
      ctx,
    );
    expect(r).toEqual({ ok: false, reason: "EXPIRED" });
  });

  it("INACTIVE si isActive=false", () => {
    const r = validateCoupon(makeCoupon({ isActive: false }), ctx);
    expect(r).toEqual({ ok: false, reason: "INACTIVE" });
  });

  it("MIN_SUBTOTAL_NOT_REACHED si subtotal < minSubtotal", () => {
    const r = validateCoupon(makeCoupon({ minSubtotal: 200_000 }), ctx);
    expect(r).toEqual({ ok: false, reason: "MIN_SUBTOTAL_NOT_REACHED" });
  });

  it("MAX_USES_REACHED si usedCount >= maxUses", () => {
    const r = validateCoupon(
      makeCoupon({ usedCount: 100, maxUses: 100 }),
      ctx,
    );
    expect(r).toEqual({ ok: false, reason: "MAX_USES_REACHED" });
  });
});

describe("computeDiscount", () => {
  it("percent: aplica porcentaje redondeado al subtotal", () => {
    const r = computeDiscount(makeCoupon({ type: "percent", value: 10 }), 99_999);
    // 99_999 * 10 / 100 = 9999.9 -> 10_000
    expect(r).toEqual({ discountSubtotal: 10_000, freeShipping: false });
  });

  it("percent: cap al subtotal cuando el porcentaje sería mayor", () => {
    const r = computeDiscount(
      makeCoupon({ type: "percent", value: 150 }),
      50_000,
    );
    expect(r).toEqual({ discountSubtotal: 50_000, freeShipping: false });
  });

  it("fixed: descuenta el valor pero nunca más que el subtotal", () => {
    const ok = computeDiscount(
      makeCoupon({ type: "fixed", value: 5_000 }),
      20_000,
    );
    expect(ok).toEqual({ discountSubtotal: 5_000, freeShipping: false });

    const capped = computeDiscount(
      makeCoupon({ type: "fixed", value: 50_000 }),
      20_000,
    );
    expect(capped).toEqual({ discountSubtotal: 20_000, freeShipping: false });
  });

  it("free_shipping: marca el flag y no descuenta subtotal", () => {
    const r = computeDiscount(
      makeCoupon({ type: "free_shipping", value: 0 }),
      80_000,
    );
    expect(r).toEqual({ discountSubtotal: 0, freeShipping: true });
  });
});
