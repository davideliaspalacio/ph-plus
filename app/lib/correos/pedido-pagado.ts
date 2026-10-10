import "server-only";

import { formatCOP } from "@/src/shared/lib/format";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

import { enviarCorreo, type EnviarCorreoResult } from "./enviar";
import { renderPedidoConfirmacion } from "./pedido-confirmacion";

/**
 * Aviso interno "llegó un pedido pagado". Por ahora va a un solo destinatario
 * (`CORREO_PEDIDOS`, por defecto los de abajo); no se le escribe al cliente.
 */
const DEFAULT_DESTINATARIOS = [
  "comercial2@aguaphplus.com",
  "davideliaspalacioo@gmail.com",
];

/** `CORREO_PEDIDOS` admite varias direcciones separadas por coma o punto y coma. */
export function destinatariosPedidos(raw: string | undefined): string[] {
  const list = (raw ?? "")
    .split(/[,;]/)
    .map((v) => v.trim())
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_DESTINATARIOS;
}

export type PedidoPagadoData = {
  orderId: string;
  contact: { name?: string; email?: string; phone?: string };
  shipping: { address?: string; city?: string; department?: string; notes?: string };
  totals: { subtotal?: number; discount?: number; shipping?: number; total?: number };
  lines: Array<{ title: string; quantity: number; line_total: number }>;
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderPedidoPagado(data: PedidoPagadoData): { subject: string; html: string } {
  const { orderId, contact, shipping, totals, lines } = data;
  const e = escapeHtml;

  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:6px 0">${e(line.title)} × ${e(line.quantity)}</td>` +
        `<td style="padding:6px 0;text-align:right">${e(formatCOP(Number(line.line_total)))}</td></tr>`,
    )
    .join("");

  const direccion = [shipping.address, shipping.city, shipping.department]
    .filter(Boolean)
    .join(", ");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
<div style="max-width:560px;margin:0 auto;padding:24px;background:#ffffff">
  <h1 style="font-size:20px;margin:0 0 4px">Nuevo pedido pagado</h1>
  <p style="margin:0 0 20px;color:#666">Pedido <strong>${e(orderId)}</strong></p>

  <h2 style="font-size:15px;margin:0 0 8px">Cliente</h2>
  <p style="margin:0 0 20px;line-height:1.5">
    ${e(contact.name)}<br>${e(contact.email)}<br>${e(contact.phone)}
  </p>

  <h2 style="font-size:15px;margin:0 0 8px">Envío</h2>
  <p style="margin:0 0 20px;line-height:1.5">
    ${e(direccion)}${shipping.notes ? `<br><em>Notas: ${e(shipping.notes)}</em>` : ""}
  </p>

  <h2 style="font-size:15px;margin:0 0 8px">Productos</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows}
    <tr><td style="padding:6px 0;border-top:1px solid #ddd">Subtotal</td>
        <td style="padding:6px 0;border-top:1px solid #ddd;text-align:right">${e(formatCOP(Number(totals.subtotal ?? 0)))}</td></tr>
    <tr><td style="padding:6px 0">Envío</td>
        <td style="padding:6px 0;text-align:right">${e(formatCOP(Number(totals.shipping ?? 0)))}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold">Total pagado</td>
        <td style="padding:6px 0;text-align:right;font-weight:bold">${e(formatCOP(Number(totals.total ?? 0)))}</td></tr>
  </table>
</div>
</body></html>`;

  return {
    subject: `Nuevo pedido pagado ${orderId} — ${formatCOP(Number(totals.total ?? 0))}`,
    html,
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Carga la orden + líneas y manda DOS correos independientes:
 *  1. Aviso interno a PH PLUS (`CORREO_PEDIDOS`, por defecto comercial2@ y el
 *     correo anterior) para gestionar el despacho.
 *  2. Confirmación de compra al CLIENTE, al correo que escribió en el checkout.
 *
 * Nunca tira, y un correo que falla no impide el otro: cada envío es
 * fail-safe por sí mismo. Se llama justo cuando la orden pasa a `paid`, que
 * ocurre una sola vez por orden (la transición sólo sale de
 * `pending_payment`/`draft`), así que no hay avisos duplicados.
 *
 * Devuelve el resultado del aviso interno (el que importa operativamente);
 * el del cliente se registra en el log.
 */
export async function notificarPedidoPagado(orderId: string): Promise<EnviarCorreoResult> {
  let data: PedidoPagadoData;
  try {
    const supabase = await createSupabaseServiceClient();
    const [{ data: order, error: orderError }, { data: lines, error: linesError }] =
      await Promise.all([
        supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
        supabase.from("order_lines").select("title, quantity, line_total").eq("order_id", orderId),
      ]);

    if (orderError || !order) {
      throw new Error(orderError?.message ?? `orden ${orderId} no encontrada`);
    }
    if (linesError) throw new Error(linesError.message);

    const row = order as unknown as Omit<PedidoPagadoData, "orderId" | "lines">;
    data = {
      orderId,
      contact: row.contact ?? {},
      shipping: row.shipping ?? {},
      totals: row.totals ?? {},
      lines: (lines ?? []) as PedidoPagadoData["lines"],
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[correos] No se pudo cargar el pedido pagado ${orderId}: ${reason}`);
    return { sent: false, reason };
  }

  const interno = enviarAvisoInterno(data);
  const cliente = enviarConfirmacionCliente(data);
  const [resultadoInterno] = await Promise.all([interno, cliente]);
  return resultadoInterno;
}

async function enviarAvisoInterno(data: PedidoPagadoData): Promise<EnviarCorreoResult> {
  try {
    const { subject, html } = renderPedidoPagado(data);
    const result = await enviarCorreo({
      to: destinatariosPedidos(process.env.CORREO_PEDIDOS),
      subject,
      html,
      reference: data.orderId,
    });
    if (!result.sent) {
      console.error(`[correos] Aviso interno no enviado (${data.orderId}): ${result.reason}`);
    }
    return result;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[correos] Aviso interno falló (${data.orderId}): ${reason}`);
    return { sent: false, reason };
  }
}

async function enviarConfirmacionCliente(data: PedidoPagadoData): Promise<EnviarCorreoResult> {
  const to = data.contact.email?.trim();
  if (!to || !EMAIL_RE.test(to)) {
    return { sent: false, reason: "el pedido no tiene un correo de cliente válido" };
  }
  try {
    const { subject, html } = renderPedidoConfirmacion(data);
    const result = await enviarCorreo({
      to,
      subject,
      html,
      reference: `${data.orderId}-cliente`,
    });
    if (!result.sent) {
      console.error(`[correos] Confirmación al cliente no enviada (${data.orderId}): ${result.reason}`);
    }
    return result;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[correos] Confirmación al cliente falló (${data.orderId}): ${reason}`);
    return { sent: false, reason };
  }
}
