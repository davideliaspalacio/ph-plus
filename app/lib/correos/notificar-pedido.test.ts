import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

const enviarCorreo = vi.fn();
vi.mock("./enviar", () => ({ enviarCorreo: (...a: unknown[]) => enviarCorreo(...a) }));

let orderRow: Record<string, unknown> | null = null;
let orderError: { message: string } | null = null;
vi.mock("@/src/shared/supabase/server", () => ({
  createSupabaseServiceClient: async () => ({
    from(table: string) {
      const q = {
        select: () => q,
        eq: () => q,
        maybeSingle: async () => ({ data: orderRow, error: orderError }),
        then: (resolve: (v: unknown) => void) =>
          resolve({
            data: [{ title: "Kit inicial de botellón 19 lts", quantity: 1, line_total: 78000 }],
            error: null,
          }),
      };
      return table === "orders" ? q : q;
    },
  }),
}));

import { notificarPedidoPagado } from "./pedido-pagado";

const ORDER = {
  contact: { name: "María Rojas", email: "maria@example.com", phone: "3001234567" },
  shipping: { address: "Cra 15 # 93-60", city: "Bogotá", department: "Bogotá D.C.", notes: "" },
  totals: { subtotal: 78000, discount: 0, shipping: 11000, total: 89000 },
};

describe("notificarPedidoPagado", () => {
  beforeEach(() => {
    enviarCorreo.mockReset();
    enviarCorreo.mockResolvedValue({ sent: true, provider: "zeptomail" });
    orderRow = { ...ORDER };
    orderError = null;
    delete process.env.CORREO_PEDIDOS;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("manda el aviso interno a los dos destinatarios y la confirmación al cliente", async () => {
    const result = await notificarPedidoPagado("ORD-1");

    expect(result.sent).toBe(true);
    expect(enviarCorreo).toHaveBeenCalledTimes(2);
    const calls = enviarCorreo.mock.calls.map((c) => c[0] as { to: unknown; subject: string });
    const interno = calls.find((c) => Array.isArray(c.to))!;
    const cliente = calls.find((c) => c.to === "maria@example.com")!;

    expect(interno.to).toEqual(["comercial2@aguaphplus.com", "davideliaspalacioo@gmail.com"]);
    expect(interno.subject).toContain("Nuevo pedido pagado ORD-1");
    expect(cliente.subject).toContain("Gracias por tu compra");
    expect(cliente.subject).toContain("ORD-1");
  });

  it("respeta CORREO_PEDIDOS para el aviso interno", async () => {
    process.env.CORREO_PEDIDOS = "a@x.co, b@y.co";
    await notificarPedidoPagado("ORD-1");
    const interno = enviarCorreo.mock.calls
      .map((c) => c[0] as { to: unknown })
      .find((c) => Array.isArray(c.to))!;
    expect(interno.to).toEqual(["a@x.co", "b@y.co"]);
  });

  it("si falla el correo al cliente, el aviso interno igual sale", async () => {
    enviarCorreo.mockImplementation(async (input: { to: unknown }) =>
      input.to === "maria@example.com"
        ? { sent: false, reason: "proveedor caído" }
        : { sent: true, provider: "zeptomail" },
    );
    const result = await notificarPedidoPagado("ORD-1");
    expect(result.sent).toBe(true);
    expect(enviarCorreo).toHaveBeenCalledTimes(2);
  });

  it("si el envío al cliente lanza una excepción, no rompe el aviso interno", async () => {
    enviarCorreo.mockImplementation(async (input: { to: unknown }) => {
      if (input.to === "maria@example.com") throw new Error("boom");
      return { sent: true, provider: "zeptomail" };
    });
    await expect(notificarPedidoPagado("ORD-1")).resolves.toMatchObject({ sent: true });
  });

  it("no le escribe al cliente si el correo no es válido, pero avisa al equipo", async () => {
    orderRow = { ...ORDER, contact: { ...ORDER.contact, email: "no-es-un-correo" } };
    const result = await notificarPedidoPagado("ORD-1");
    expect(result.sent).toBe(true);
    expect(enviarCorreo).toHaveBeenCalledTimes(1);
    expect((enviarCorreo.mock.calls[0][0] as { to: unknown }).to).toEqual([
      "comercial2@aguaphplus.com",
      "davideliaspalacioo@gmail.com",
    ]);
  });

  it("no tira y no envía nada si la orden no existe", async () => {
    orderRow = null;
    const result = await notificarPedidoPagado("ORD-X");
    expect(result).toMatchObject({ sent: false });
    expect(enviarCorreo).not.toHaveBeenCalled();
  });
});
