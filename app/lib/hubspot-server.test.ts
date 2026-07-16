import { describe, expect, it } from "vitest";

import {
  mapContactProperties,
  mapDealProperties,
  splitFullName,
} from "./hubspot-server";

describe("HubSpot mappers", () => {
  it("separa nombre y apellido(s)", () => {
    expect(splitFullName("Sirley")).toEqual({
      firstName: "Sirley",
      lastName: "",
    });
    expect(splitFullName("Sirley Montoya")).toEqual({
      firstName: "Sirley",
      lastName: "Montoya",
    });
    expect(splitFullName("  Ana María  Pérez López ")).toEqual({
      firstName: "Ana",
      lastName: "María Pérez López",
    });
    expect(splitFullName("   ")).toEqual({ firstName: "", lastName: "" });
  });

  it("mapea properties de contacto omitiendo vacíos", () => {
    expect(
      mapContactProperties({
        name: "Sirley Montoya",
        email: "sirley@example.com",
        phone: "3001234567",
        city: "Bogotá",
        address: "Calle 123",
      }),
    ).toEqual({
      email: "sirley@example.com",
      firstname: "Sirley",
      lastname: "Montoya",
      phone: "3001234567",
      city: "Bogotá",
      address: "Calle 123",
    });

    expect(
      mapContactProperties({ name: "", email: "solo@example.com" }),
    ).toEqual({ email: "solo@example.com" });
  });

  it("agrega lifecycle stage cuando se pasa", () => {
    const props = mapContactProperties(
      { name: "Ana Pérez", email: "ana@example.com" },
      { lifecycleStage: "customer" },
    );
    expect(props.lifecyclestage).toBe("customer");
  });

  it("mapea properties de negocio con nombre, monto y descripción", () => {
    const props = mapDealProperties({
      orderId: "ORD-ABC123",
      amount: 95000,
      paymentMethod: "payu",
      itemsSummary: "Botellón 19 lts x2",
    });
    expect(props.dealname).toBe("Pedido PH PLUS ORD-ABC123");
    expect(props.amount).toBe("95000");
    expect(props.description).toContain("payu");
    expect(props.description).toContain("Botellón 19 lts x2");
    expect(props.dealstage).toBeUndefined();
  });

  it("incluye pipeline y stage cuando se proveen", () => {
    const props = mapDealProperties({
      orderId: "ORD-1",
      amount: 1000,
      paymentMethod: "cash_on_delivery",
      itemsSummary: "x1",
      pipeline: "default",
      stage: "appointmentscheduled",
    });
    expect(props.pipeline).toBe("default");
    expect(props.dealstage).toBe("appointmentscheduled");
  });
});
