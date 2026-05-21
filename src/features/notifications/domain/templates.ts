import { formatCOP } from "@/src/shared/lib/format";
import type { EmailTemplate } from "./email";

/**
 * Templates de email. Cada uno produce `{ subject, html }` a partir de un
 * payload arbitrario. La implementación es HTML inline minimalista — el día
 * que tengamos un servicio real de email, lo reemplazamos por MJML o Resend.
 *
 * `renderTemplate(template, payload)` valida que el template exista y lo
 * renderiza. Si el template no existe, tira.
 */

export type RenderedEmail = {
  subject: string;
  html: string;
};

export type TemplateRenderer = (
  payload: Record<string, unknown>,
) => RenderedEmail;

function pickString(payload: Record<string, unknown>, key: string): string {
  const v = payload[key];
  return v == null ? "" : String(v);
}

function pickNumber(payload: Record<string, unknown>, key: string): number {
  const v = payload[key];
  return typeof v === "number" ? v : Number(v ?? 0);
}

const renderers: Record<EmailTemplate, TemplateRenderer> = {
  order_confirmation: (payload) => {
    const orderId = pickString(payload, "orderId");
    const total = pickNumber(payload, "total");
    return {
      subject: `Pedido ${orderId} confirmado`,
      html: `<h1>Gracias por tu compra</h1><p>Tu pedido <strong>${orderId}</strong> fue confirmado.</p><p>Total: <strong>${formatCOP(total)}</strong></p>`,
    };
  },

  order_shipped: (payload) => {
    const orderId = pickString(payload, "orderId");
    const tracking = pickString(payload, "tracking");
    return {
      subject: `Tu pedido ${orderId} fue enviado`,
      html: `<h1>Tu pedido va en camino</h1><p>Pedido <strong>${orderId}</strong> enviado.</p><p>Tracking: <code>${tracking}</code></p>`,
    };
  },

  password_recover: (payload) => {
    const link = pickString(payload, "link");
    return {
      subject: "Recupera tu contraseña",
      html: `<h1>Recuperación de contraseña</h1><p>Hacé click en el siguiente enlace para crear una nueva contraseña:</p><p><a href="${link}">${link}</a></p>`,
    };
  },

  welcome: (payload) => {
    const name = pickString(payload, "name");
    return {
      subject: "Bienvenido a PH PLUS",
      html: `<h1>Hola ${name}</h1><p>Gracias por sumarte a PH PLUS. Empezá a explorar el catálogo y aprovechá las novedades.</p>`,
    };
  },

  review_approved: (payload) => {
    const productName = pickString(payload, "productName");
    return {
      subject: "Tu reseña fue publicada",
      html: `<h1>Tu reseña fue aprobada</h1><p>Tu reseña sobre <strong>${productName}</strong> ya es pública. ¡Gracias por aportar!</p>`,
    };
  },

  low_stock_alert: (payload) => {
    const sku = pickString(payload, "sku");
    const stock = pickNumber(payload, "stock");
    return {
      subject: `Alerta de stock bajo: ${sku}`,
      html: `<h1>Stock bajo</h1><p>El SKU <strong>${sku}</strong> tiene <strong>${stock}</strong> unidades.</p>`,
    };
  },

  custom: (payload) => {
    const subject = pickString(payload, "subject") || "Mensaje";
    const html = pickString(payload, "html") || "<p></p>";
    return { subject, html };
  },
};

export function renderTemplate(
  template: EmailTemplate,
  payload: Record<string, unknown> = {},
): RenderedEmail {
  const renderer = renderers[template];
  if (!renderer) {
    throw new Error(`Unknown email template: ${template}`);
  }
  return renderer(payload);
}
