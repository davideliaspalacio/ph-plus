import { describe, expect, it } from "vitest";
import { EmailMessageSchema } from "./email";

/**
 * Tests del schema EmailMessage: campos requeridos, enums, email válido.
 */

const base = {
  id: "e1",
  to: "cliente@example.com",
  subject: "Pedido confirmado",
  html: "<p>Gracias</p>",
  template: "order_confirmation" as const,
  status: "queued" as const,
  createdAt: "2026-05-20T12:00:00.000Z",
};

describe("EmailMessageSchema", () => {
  it("acepta un email válido con campos mínimos", () => {
    const parsed = EmailMessageSchema.parse(base);
    expect(parsed.id).toBe("e1");
    expect(parsed.status).toBe("queued");
  });

  it("rechaza un to inválido (no es email)", () => {
    expect(() =>
      EmailMessageSchema.parse({ ...base, to: "no-es-email" }),
    ).toThrow();
  });

  it("rechaza un template fuera del enum", () => {
    expect(() =>
      EmailMessageSchema.parse({ ...base, template: "bogus" }),
    ).toThrow();
  });

  it("acepta los tres estados: queued | sent | failed", () => {
    for (const status of ["queued", "sent", "failed"] as const) {
      const parsed = EmailMessageSchema.parse({ ...base, status });
      expect(parsed.status).toBe(status);
    }
    expect(() =>
      EmailMessageSchema.parse({ ...base, status: "draft" }),
    ).toThrow();
  });

  it("acepta payload, error y sentAt opcionales", () => {
    const parsed = EmailMessageSchema.parse({
      ...base,
      payload: { orderId: "ORD-1", total: 50000 },
      status: "sent",
      sentAt: "2026-05-20T12:00:05.000Z",
    });
    expect(parsed.payload?.orderId).toBe("ORD-1");
    expect(parsed.sentAt).toBe("2026-05-20T12:00:05.000Z");
  });

  it("rechaza subject vacío", () => {
    expect(() => EmailMessageSchema.parse({ ...base, subject: "" })).toThrow();
  });
});
