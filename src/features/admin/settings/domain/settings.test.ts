import { describe, expect, it } from "vitest";
import { SettingsSchema } from "./settings";

describe("SettingsSchema", () => {
  it("acepta un settings válido sin address (opcional)", () => {
    const s = SettingsSchema.parse({
      businessName: "PH PLUS",
      nit: "900.123.456-7",
      phone: "+57 323 439 2470",
      whatsapp: "+57 323 439 2470",
      taxRate: 0,
      paymentMethods: ["credit_card", "pse"],
      policies: { shipping: "/envios", returns: "/devoluciones" },
    });
    expect(s.address).toBeUndefined();
    expect(s.paymentMethods).toHaveLength(2);
  });

  it("acepta address opcional cuando se pasa", () => {
    const s = SettingsSchema.parse({
      businessName: "PH PLUS",
      nit: "900.123.456-7",
      phone: "+57 1 234",
      whatsapp: "+57 300 000",
      address: "Calle 1 #2-3, Bogotá",
      taxRate: 0.19,
      paymentMethods: ["nequi"],
      policies: { shipping: "/envios", returns: "/devoluciones" },
    });
    expect(s.address).toBe("Calle 1 #2-3, Bogotá");
    expect(s.taxRate).toBe(0.19);
  });

  it("rechaza taxRate fuera de [0..1] y businessName vacío", () => {
    expect(() =>
      SettingsSchema.parse({
        businessName: "PH PLUS",
        nit: "x",
        phone: "x",
        whatsapp: "x",
        taxRate: 1.5,
        paymentMethods: [],
        policies: { shipping: "/a", returns: "/b" },
      }),
    ).toThrow();
    expect(() =>
      SettingsSchema.parse({
        businessName: "",
        nit: "x",
        phone: "x",
        whatsapp: "x",
        taxRate: 0,
        paymentMethods: [],
        policies: { shipping: "/a", returns: "/b" },
      }),
    ).toThrow();
  });
});
