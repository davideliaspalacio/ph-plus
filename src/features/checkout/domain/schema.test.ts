import { describe, expect, it } from "vitest";
import {
  CheckoutFormSchema,
  ContactSchema,
  PaymentSchema,
  ShippingAddressSchema,
} from "./schema";

describe("ContactSchema", () => {
  it("acepta un contacto válido", () => {
    const r = ContactSchema.safeParse({
      name: "Sirley Montoya",
      email: "sirley@correo.com",
      phone: "+57 300 000 0000",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza email mal formado", () => {
    const r = ContactSchema.safeParse({
      name: "x",
      email: "noesemail",
      phone: "3000000000",
    });
    expect(r.success).toBe(false);
  });

  it("rechaza teléfono con menos de 7 dígitos", () => {
    const r = ContactSchema.safeParse({
      name: "x",
      email: "x@y.com",
      phone: "12345",
    });
    expect(r.success).toBe(false);
  });

  it("rechaza nombre vacío", () => {
    const r = ContactSchema.safeParse({
      name: "",
      email: "x@y.com",
      phone: "3001234567",
    });
    expect(r.success).toBe(false);
  });
});

describe("ShippingAddressSchema", () => {
  it("acepta dirección completa", () => {
    const r = ShippingAddressSchema.safeParse({
      address: "Calle 123 # 45-67",
      city: "Bogotá",
      department: "Cundinamarca",
      postalCode: "110111",
      notes: "Apto 101",
    });
    expect(r.success).toBe(true);
  });

  it("acepta dirección sin postal y sin notes", () => {
    const r = ShippingAddressSchema.safeParse({
      address: "Calle 123",
      city: "Medellín",
      department: "Antioquia",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza city vacío", () => {
    const r = ShippingAddressSchema.safeParse({
      address: "Calle 123",
      city: "",
    });
    expect(r.success).toBe(false);
  });

  it("rechaza departamento no listado", () => {
    const r = ShippingAddressSchema.safeParse({
      address: "Calle 123",
      city: "Bogotá",
      department: "Narnia",
    });
    expect(r.success).toBe(false);
  });

  it("acepta departamento ausente (opcional)", () => {
    const r = ShippingAddressSchema.safeParse({
      address: "Calle 123",
      city: "Bogotá",
    });
    expect(r.success).toBe(true);
  });
});

describe("PaymentSchema", () => {
  it("acepta credit_card sin card4Last", () => {
    const r = PaymentSchema.safeParse({ method: "credit_card" });
    expect(r.success).toBe(true);
  });

  it("acepta credit_card con card4Last válido", () => {
    const r = PaymentSchema.safeParse({
      method: "credit_card",
      card4Last: "1234",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza card4Last con caracteres no numéricos", () => {
    const r = PaymentSchema.safeParse({
      method: "credit_card",
      card4Last: "12ab",
    });
    expect(r.success).toBe(false);
  });

  it("acepta otros métodos (pse, nequi, cash_on_delivery, payu)", () => {
    expect(PaymentSchema.safeParse({ method: "pse" }).success).toBe(true);
    expect(PaymentSchema.safeParse({ method: "nequi" }).success).toBe(true);
    expect(
      PaymentSchema.safeParse({ method: "cash_on_delivery" }).success,
    ).toBe(true);
    expect(PaymentSchema.safeParse({ method: "payu" }).success).toBe(true);
  });

  it("rechaza método inválido", () => {
    const r = PaymentSchema.safeParse({ method: "btc" });
    expect(r.success).toBe(false);
  });
});

describe("CheckoutFormSchema", () => {
  it("compone contact + shipping + payment", () => {
    const r = CheckoutFormSchema.safeParse({
      contact: {
        name: "Ana",
        email: "ana@y.com",
        phone: "3001234567",
      },
      shipping: {
        address: "Calle 1",
        city: "Bogotá",
      },
      payment: { method: "pse" },
    });
    expect(r.success).toBe(true);
  });

  it("falla si cualquier sub-schema falla", () => {
    const r = CheckoutFormSchema.safeParse({
      contact: { name: "", email: "ana@y.com", phone: "3001234567" },
      shipping: { address: "Calle 1", city: "Bogotá" },
      payment: { method: "pse" },
    });
    expect(r.success).toBe(false);
  });
});
