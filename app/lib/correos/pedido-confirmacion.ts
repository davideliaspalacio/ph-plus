import { formatCOP } from "@/src/shared/lib/format";

import type { PedidoPagadoData } from "./pedido-pagado";

/**
 * Correo de confirmación de compra para el CLIENTE.
 *
 * Función pura (sin red ni DB) para poder probarla y previsualizarla. HTML
 * compatible con clientes de correo: layout con <table>, estilos en línea y
 * ancho fijo de 600px (Gmail, Outlook y Apple Mail ignoran CSS externo y
 * casi todo el flex/grid).
 */

const SITE = "https://www.aguaphplus.com";
const WHATSAPP = "573234392470";
const BRAND = "#1e3a8a";
const BRAND_DARK = "#1b22a6";
const SOFT = "#eef0ff";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function primerNombre(name: string | undefined): string {
  const first = (name ?? "").trim().split(/\s+/)[0];
  return first || "";
}

export function renderPedidoConfirmacion(data: PedidoPagadoData): {
  subject: string;
  html: string;
} {
  const { orderId, contact, shipping, totals, lines } = data;
  const e = escapeHtml;
  const nombre = primerNombre(contact.name);
  const total = formatCOP(Number(totals.total ?? 0));

  const filas = lines
    .map(
      (line) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e6e8f0;font-size:15px;color:#1f2430">
            ${e(line.title)}
            <div style="font-size:13px;color:#6b7280;margin-top:2px">Cantidad: ${e(line.quantity)}</div>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #e6e8f0;font-size:15px;color:#1f2430;white-space:nowrap">
            ${e(formatCOP(Number(line.line_total)))}
          </td>
        </tr>`,
    )
    .join("");

  const direccion = [shipping.address, shipping.city, shipping.department]
    .filter(Boolean)
    .join(", ");

  const descuento = Number(totals.discount ?? 0);
  const urlPedido = `${SITE}/pedido/${encodeURIComponent(orderId)}`;
  const urlWhatsapp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola, tengo una consulta sobre mi pedido ${orderId}.`,
  )}`;

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confirmación de tu pedido ${e(orderId)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f8;font-family:Arial,Helvetica,sans-serif;color:#1f2430">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">
  Recibimos tu pago de ${e(total)}. Ya estamos preparando tu pedido ${e(orderId)}.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f8">
  <tr><td align="center" style="padding:24px 12px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">

      <!-- Encabezado -->
      <tr>
        <td align="center" style="background:${BRAND};padding:28px 24px 24px">
          <img src="${SITE}/og-logo.png" width="84" height="84" alt="PH PLUS" style="display:block;border:0;border-radius:42px;background:#ffffff">
          <div style="margin-top:14px;font-size:13px;letter-spacing:2px;color:#b9c4f5;font-weight:bold">AGUA ALCALINA PH 9</div>
        </td>
      </tr>

      <!-- Agradecimiento -->
      <tr>
        <td style="padding:32px 32px 8px;text-align:center">
          <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:28px;background:#22a559;color:#ffffff;font-size:30px;font-weight:bold">&#10003;</div>
          <h1 style="margin:16px 0 8px;font-size:26px;line-height:1.25;color:${BRAND}">
            ${nombre ? `¡Gracias por tu compra, ${e(nombre)}!` : "¡Gracias por tu compra!"}
          </h1>
          <p style="margin:0;font-size:16px;line-height:1.5;color:#4b5563">
            Recibimos tu pago y ya estamos preparando tu pedido.
          </p>
        </td>
      </tr>

      <!-- Número de pedido -->
      <tr>
        <td style="padding:20px 32px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};border-radius:12px">
            <tr>
              <td style="padding:16px 20px">
                <div style="font-size:12px;letter-spacing:1px;color:#6b7280;font-weight:bold">NÚMERO DE PEDIDO</div>
                <div style="font-size:20px;font-weight:bold;color:${BRAND};margin-top:4px">${e(orderId)}</div>
              </td>
              <td align="right" style="padding:16px 20px">
                <div style="font-size:12px;letter-spacing:1px;color:#6b7280;font-weight:bold">TOTAL PAGADO</div>
                <div style="font-size:20px;font-weight:bold;color:${BRAND};margin-top:4px">${e(total)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Productos -->
      <tr>
        <td style="padding:24px 32px 0">
          <h2 style="margin:0 0 4px;font-size:17px;color:${BRAND}">Tu pedido</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${filas}
            <tr>
              <td style="padding:12px 0 4px;font-size:14px;color:#6b7280">Subtotal</td>
              <td align="right" style="padding:12px 0 4px;font-size:14px;color:#6b7280">${e(formatCOP(Number(totals.subtotal ?? 0)))}</td>
            </tr>
            ${
              descuento > 0
                ? `<tr><td style="padding:4px 0;font-size:14px;color:#6b7280">Descuento</td>
                   <td align="right" style="padding:4px 0;font-size:14px;color:#22a559">- ${e(formatCOP(descuento))}</td></tr>`
                : ""
            }
            <tr>
              <td style="padding:4px 0;font-size:14px;color:#6b7280">Envío</td>
              <td align="right" style="padding:4px 0;font-size:14px;color:#6b7280">${e(formatCOP(Number(totals.shipping ?? 0)))}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0;font-size:17px;font-weight:bold;color:${BRAND}">Total</td>
              <td align="right" style="padding:12px 0 0;font-size:17px;font-weight:bold;color:${BRAND}">${e(total)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Entrega -->
      <tr>
        <td style="padding:28px 32px 0">
          <h2 style="margin:0 0 8px;font-size:17px;color:${BRAND}">Dónde lo entregamos</h2>
          <p style="margin:0;font-size:15px;line-height:1.55;color:#1f2430">
            ${e(contact.name)}<br>${e(direccion)}${contact.phone ? `<br>Tel. ${e(contact.phone)}` : ""}
          </p>
          ${
            shipping.notes
              ? `<p style="margin:8px 0 0;font-size:14px;color:#6b7280"><em>Notas de entrega: ${e(shipping.notes)}</em></p>`
              : ""
          }
        </td>
      </tr>

      <!-- Qué sigue -->
      <tr>
        <td style="padding:28px 32px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e6e8f0;border-radius:12px">
            <tr><td style="padding:16px 20px">
              <div style="font-size:15px;font-weight:bold;color:${BRAND};margin-bottom:6px">¿Qué sigue?</div>
              <div style="font-size:14px;line-height:1.6;color:#4b5563">
                Nuestro equipo alistará tu pedido y se pondrá en contacto contigo para coordinar la entrega.
                Guarda este correo: tu número de pedido es <strong>${e(orderId)}</strong>.
              </div>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- Botones -->
      <tr>
        <td align="center" style="padding:28px 32px 8px">
          <a href="${urlPedido}" style="display:inline-block;background:${BRAND_DARK};color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:999px">Ver el estado de mi pedido</a>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:6px 32px 32px">
          <a href="${urlWhatsapp}" style="font-size:14px;color:#1e8a4c;text-decoration:underline;font-weight:bold">¿Dudas? Escríbenos por WhatsApp</a>
        </td>
      </tr>

      <!-- Pie -->
      <tr>
        <td style="background:#f8f9fc;padding:22px 32px;text-align:center;border-top:1px solid #e6e8f0">
          <div style="font-size:13px;color:#6b7280;line-height:1.6">
            <strong style="color:${BRAND}">PH PLUS</strong> · Inversiones PH PLUS S.A.S. · NIT 901.219.610.3<br>
            Av km 1,5 vía Siberia, Parque Agroindustrial de Occidente, Bodega 2 local 78, Cota<br>
            <a href="mailto:info@aguaphplus.com" style="color:${BRAND}">info@aguaphplus.com</a> ·
            <a href="${SITE}" style="color:${BRAND}">aguaphplus.com</a>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return {
    subject: `¡Gracias por tu compra! Pedido ${orderId} confirmado`,
    html,
  };
}
