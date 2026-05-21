import { describe, expect, it } from "vitest";
import { renderTemplate } from "./templates";

/**
 * Tests de los templates: cada uno debe sustituir los placeholders del payload
 * en subject + html. Template inexistente tira.
 */

describe("renderTemplate", () => {
  it("order_confirmation incluye orderId y total formateado a COP", () => {
    const { subject, html } = renderTemplate("order_confirmation", {
      orderId: "ORD-123",
      total: 36000,
    });
    expect(subject).toBe("Pedido ORD-123 confirmado");
    expect(html).toContain("ORD-123");
    // formatCOP usa Intl es-CO; al menos el número debe aparecer
    expect(html).toContain("36");
  });

  it("order_shipped incluye orderId y tracking", () => {
    const { subject, html } = renderTemplate("order_shipped", {
      orderId: "ORD-9",
      tracking: "TRK-XYZ",
    });
    expect(subject).toContain("ORD-9");
    expect(html).toContain("ORD-9");
    expect(html).toContain("TRK-XYZ");
  });

  it("password_recover incluye el link de recuperación", () => {
    const { subject, html } = renderTemplate("password_recover", {
      link: "https://phplus.test/reset?t=abc",
    });
    expect(subject.toLowerCase()).toContain("contraseña");
    expect(html).toContain("https://phplus.test/reset?t=abc");
  });

  it("welcome saluda con el nombre", () => {
    const { subject, html } = renderTemplate("welcome", { name: "Mariana" });
    expect(subject.toLowerCase()).toContain("bienvenido");
    expect(html).toContain("Mariana");
  });

  it("review_approved menciona el producto", () => {
    const { subject, html } = renderTemplate("review_approved", {
      productName: "Camiseta Negra",
    });
    expect(subject.toLowerCase()).toContain("reseña");
    expect(html).toContain("Camiseta Negra");
  });

  it("low_stock_alert muestra sku y stock", () => {
    const { subject, html } = renderTemplate("low_stock_alert", {
      sku: "SKU-001",
      stock: 2,
    });
    expect(subject).toContain("SKU-001");
    expect(html).toContain("SKU-001");
    expect(html).toContain("2");
  });

  it("custom respeta subject y html del payload", () => {
    const { subject, html } = renderTemplate("custom", {
      subject: "Mi asunto",
      html: "<p>Mi html</p>",
    });
    expect(subject).toBe("Mi asunto");
    expect(html).toBe("<p>Mi html</p>");
  });

  it("template inexistente tira", () => {
    expect(() =>
      // @ts-expect-error: probando template inválido en runtime
      renderTemplate("does_not_exist", {}),
    ).toThrow(/Unknown email template/);
  });
});
