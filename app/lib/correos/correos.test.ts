import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { enviarCorreo, normalizeZeptoToken, parseAddress } from "./enviar";
import { renderPedidoPagado } from "./pedido-pagado";

describe("ZeptoMail helpers", () => {
  it("acepta el token con o sin prefijo Zoho-enczapikey", () => {
    expect(normalizeZeptoToken("Zoho-enczapikey abc123")).toBe("abc123");
    expect(normalizeZeptoToken("  abc123 ")).toBe("abc123");
  });

  it("parsea `Nombre <correo>` y correos sueltos", () => {
    expect(parseAddress("PH PLUS <noreply@ph-plus.co>")).toEqual({
      name: "PH PLUS",
      address: "noreply@ph-plus.co",
    });
    expect(parseAddress("a@b.co")).toEqual({ address: "a@b.co" });
  });
});

describe("enviarCorreo", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("no tira y no llama a la API si falta la llave", async () => {
    vi.stubEnv("ZEPTOMAIL_API_KEY", "");
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await enviarCorreo({ to: "a@b.co", subject: "x", html: "<p>x</p>" });

    expect(result.sent).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("manda el POST con la cabecera y el client_reference", async () => {
    vi.stubEnv("ZEPTOMAIL_API_KEY", "Zoho-enczapikey tok");
    vi.stubEnv("CORREO_REMITENTE", "PH PLUS <noreply@ph-plus.co>");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ request_id: "req-1" }), { status: 201 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await enviarCorreo({
      to: "dest@x.co",
      subject: "Hola",
      html: "<p>hola</p>",
      reference: "ORD-1",
    });

    expect(result).toEqual({ sent: true, provider: "zeptomail", requestId: "req-1" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.zeptomail.com/v1.1/email");
    expect(init.headers.Authorization).toBe("Zoho-enczapikey tok");
    const body = JSON.parse(init.body);
    expect(body.from).toEqual({ name: "PH PLUS", address: "noreply@ph-plus.co" });
    expect(body.to).toEqual([{ email_address: { address: "dest@x.co" } }]);
    expect(body.client_reference).toBe("ORD-1");
  });

  it("usa Resend con onboarding@resend.dev si no hay ZeptoMail", async () => {
    vi.stubEnv("ZEPTOMAIL_API_KEY", "");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "rs-1" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await enviarCorreo({ to: "dest@x.co", subject: "Hola", html: "<p>hola</p>", reference: "ORD-1" });

    expect(result).toEqual({ sent: true, provider: "resend", requestId: "rs-1" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body.from).toBe("PH PLUS <onboarding@resend.dev>");
    expect(body.to).toEqual(["dest@x.co"]);
    expect(body.html).toBe("<p>hola</p>");
  });

  it("devuelve sent:false si ZeptoMail responde error", async () => {
    vi.stubEnv("ZEPTOMAIL_API_KEY", "tok");
    vi.stubEnv("CORREO_REMITENTE", "noreply@ph-plus.co");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad", { status: 400 })));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await enviarCorreo({ to: "a@b.co", subject: "x", html: "x" });
    expect(result.sent).toBe(false);
  });
});

describe("renderPedidoPagado", () => {
  it("incluye pedido, cliente, productos y escapa HTML", () => {
    const { subject, html } = renderPedidoPagado({
      orderId: "ORD-ABC",
      contact: { name: "<b>Ana</b>", email: "ana@x.co", phone: "3001234567" },
      shipping: { address: "Calle 1", city: "Bogotá", department: "Cundinamarca" },
      totals: { subtotal: 90000, shipping: 10000, total: 100000 },
      lines: [{ title: "Agua PH PLUS", quantity: 2, line_total: 90000 }],
    });

    expect(subject).toContain("ORD-ABC");
    expect(html).toContain("Agua PH PLUS × 2");
    expect(html).toContain("Calle 1, Bogotá, Cundinamarca");
    expect(html).toContain("&lt;b&gt;Ana&lt;/b&gt;");
    expect(html).not.toContain("<b>Ana</b>");
  });
});
