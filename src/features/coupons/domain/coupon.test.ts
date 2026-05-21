import { describe, expect, it } from "vitest";
import { CouponSchema } from "./coupon";

/**
 * Tests del schema Zod del cupón: normalización y validación de tipos.
 */

const baseInput = {
  id: "c1",
  code: "  bienvenida10  ",
  type: "percent" as const,
  value: 10,
  startsAt: "2026-01-01T00:00:00.000Z",
  endsAt: "2026-12-31T23:59:59.000Z",
  minSubtotal: 0,
  maxUses: 100,
  maxUsesPerCustomer: 1,
  usedCount: 0,
  isActive: true,
};

describe("CouponSchema", () => {
  it("normaliza el code a uppercase y trim", () => {
    const parsed = CouponSchema.parse(baseInput);
    expect(parsed.code).toBe("BIENVENIDA10");
  });

  it("acepta los tres tipos válidos (percent | fixed | free_shipping)", () => {
    for (const type of ["percent", "fixed", "free_shipping"] as const) {
      const parsed = CouponSchema.parse({ ...baseInput, type });
      expect(parsed.type).toBe(type);
    }
    expect(() =>
      CouponSchema.parse({ ...baseInput, type: "buy_one_get_one" }),
    ).toThrow();
  });

  it("rechaza valor negativo", () => {
    expect(() => CouponSchema.parse({ ...baseInput, value: -5 })).toThrow();
  });
});
