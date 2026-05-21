import { describe, expect, it } from "vitest";
import { ShippingZoneSchema } from "./zone";

describe("ShippingZoneSchema", () => {
  const base = {
    id: "z1",
    name: "Bogotá D.C.",
    regions: ["Bogotá"],
    cost: 8000,
    leadTimeDaysMin: 1,
    leadTimeDaysMax: 2,
    isActive: true,
  };

  it("acepta una zona mínima válida", () => {
    const result = ShippingZoneSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("acepta freeShippingThreshold opcional", () => {
    const result = ShippingZoneSchema.safeParse({
      ...base,
      freeShippingThreshold: 120000,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza una zona sin regiones", () => {
    const result = ShippingZoneSchema.safeParse({ ...base, regions: [] });
    expect(result.success).toBe(false);
  });

  it("rechaza leadTimeDaysMax menor que leadTimeDaysMin", () => {
    const result = ShippingZoneSchema.safeParse({
      ...base,
      leadTimeDaysMin: 5,
      leadTimeDaysMax: 2,
    });
    expect(result.success).toBe(false);
  });
});
