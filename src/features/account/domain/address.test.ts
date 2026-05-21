import { describe, expect, it } from "vitest";
import { AddressSchema, NewAddressInputSchema } from "./address";

const baseInput = {
  name: "Ada Lovelace",
  line1: "Calle 123 #45-67",
  city: "Bogotá",
  department: "Cundinamarca",
  phone: "3001234567",
};

describe("AddressSchema", () => {
  it("acepta una dirección válida", () => {
    const r = AddressSchema.safeParse({
      ...baseInput,
      id: "a1",
      userId: "u1",
      label: "Casa",
      line2: "",
      postalCode: "",
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(r.success).toBe(true);
  });

  it("rechaza phone demasiado corto", () => {
    const r = AddressSchema.safeParse({
      ...baseInput,
      phone: "123",
      id: "a1",
      userId: "u1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(r.success).toBe(false);
  });
});

describe("NewAddressInputSchema", () => {
  it("acepta los campos mínimos", () => {
    const r = NewAddressInputSchema.safeParse(baseInput);
    expect(r.success).toBe(true);
  });

  it("rechaza si falta city", () => {
    const r = NewAddressInputSchema.safeParse({ ...baseInput, city: "" });
    expect(r.success).toBe(false);
  });

  it("usa default 'Casa' para label cuando no se provee", () => {
    const r = NewAddressInputSchema.parse(baseInput);
    expect(r.label).toBe("Casa");
  });
});
