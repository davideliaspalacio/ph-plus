import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
// Si la validación pasa, el handler llega a resolver precios: lo cortamos ahí
// con un centinela para comprobar "pasó la validación" sin montar todo el flujo.
vi.mock("@/app/lib/cart-summary-server", () => ({
  buildCartSummaryServer: async () => {
    throw new Error("PASO_LA_VALIDACION");
  },
}));
vi.mock("@/app/lib/auth-server", () => ({ resolveAuthenticatedUserId: async () => null }));
vi.mock("@/app/lib/hubspot-server", () => ({ syncOrderToHubspot: async () => ({}) }));
vi.mock("@/app/lib/orders-server", () => ({
  buildItemsSummary: () => "",
  isSupabaseOrderPersistenceEnabled: () => false,
  persistPendingOrder: async () => "ORD-1",
}));

import { POST } from "./route";

const VALID = {
  items: [{ slug: "kit-inicial-botellon-19lts", quantity: 1 }],
  contact: {
    name: "Patricia Londoño",
    email: "patricia@example.com",
    phone: "300 123 4567",
    documentType: "CC",
    documentNumber: "66.658.551",
  },
  shipping: { address: "Cra 15 # 93-60", city: "bogota", department: "", notes: "" },
  customerType: "guest",
};

const call = (body: unknown) =>
  POST(new Request("http://x/api/payments/wompi", { method: "POST", body: JSON.stringify(body) }));

const withContact = (patch: Record<string, unknown>) => ({
  ...VALID,
  contact: { ...VALID.contact, ...patch },
});

describe("POST /api/payments/wompi — datos del cliente", () => {
  it("acepta datos completos y normaliza (llega a resolver precios)", async () => {
    const res = await call(VALID);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("PASO_LA_VALIDACION");
  });

  it("rechaza un nombre sin apellido con un mensaje legible", async () => {
    const res = await call(withContact({ name: "Patricia" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Escribe tu nombre completo con apellidos");
    expect(body.field).toBe("contact.name");
  });

  it("exige el documento y valida su formato según el tipo", async () => {
    const sin = await call(withContact({ documentNumber: "" }));
    expect(sin.status).toBe(400);

    const mal = await call(withContact({ documentType: "CC", documentNumber: "12AB" }));
    expect(mal.status).toBe(400);
    expect((await mal.json()).field).toBe("contact.documentNumber");

    const nit = await call(withContact({ documentType: "NIT", documentNumber: "901.219.610-3" }));
    expect((await nit.json()).error).toBe("PASO_LA_VALIDACION");

    const pas = await call(withContact({ documentType: "PASAPORTE", documentNumber: "ab123456" }));
    expect((await pas.json()).error).toBe("PASO_LA_VALIDACION");
  });

  it("rechaza un tipo de documento desconocido", async () => {
    const res = await call(withContact({ documentType: "TI" }));
    expect(res.status).toBe(400);
  });

  it("exige un celular colombiano de 10 dígitos", async () => {
    const res = await call(withContact({ phone: "6011234567" }));
    expect(res.status).toBe(400);
    expect((await res.json()).field).toBe("contact.phone");
  });
});
