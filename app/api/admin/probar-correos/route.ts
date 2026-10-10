import "server-only";

import { NextResponse } from "next/server";

import { enviarCorreo, type EnviarCorreoResult } from "@/app/lib/correos/enviar";
import { renderPedidoConfirmacion } from "@/app/lib/correos/pedido-confirmacion";
import {
  destinatariosPedidos,
  renderPedidoPagado,
  type PedidoPagadoData,
} from "@/app/lib/correos/pedido-pagado";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/src/shared/supabase/server";

export const runtime = "nodejs";

const ADMIN_ROLES = new Set(["staff", "super_admin"]);

/**
 * Prueba de correos SIN pasar por la pasarela de pagos. Sólo admins con sesión.
 *
 * Manda los dos correos reales con datos de ejemplo y el asunto marcado
 * [PRUEBA]: el aviso interno a los destinatarios configurados
 * (`CORREO_PEDIDOS`) y la confirmación de compra al correo de quien lo pide.
 * No crea pedidos ni toca la DB. Devuelve el resultado de cada envío (con el
 * motivo si falló) para poder diagnosticar la configuración del proveedor.
 *
 * La confirmación va al correo de la sesión, o al que el admin indique en
 * `{ email }` (para probar con el correo real del cliente). Sólo admins
 * autenticados llegan hasta ahí.
 */
async function resolveAdminEmail(): Promise<{ email: string } | { error: string; status: number }> {
  if (
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    return { error: "Supabase no está habilitado en este ambiente", status: 503 };
  }
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id || !user.email) return { error: "Inicia sesión como administrador", status: 401 };

    const service = await createSupabaseServiceClient();
    const { data } = await service.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const role = (data as { role?: string } | null)?.role;
    if (!role || !ADMIN_ROLES.has(role)) {
      return { error: "Sólo administradores pueden probar los correos", status: 403 };
    }
    return { email: user.email };
  } catch {
    return { error: "No se pudo verificar la sesión", status: 500 };
  }
}

function describe(result: EnviarCorreoResult) {
  return result.sent
    ? { enviado: true, proveedor: result.provider }
    : { enviado: false, motivo: result.reason };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request?: Request) {
  const who = await resolveAdminEmail();
  if ("error" in who) return NextResponse.json({ error: who.error }, { status: who.status });

  // Destino opcional de la confirmación de prueba (p. ej. el correo del
  // cliente). Sólo llega acá si ya pasó la verificación de admin de arriba.
  const body = (await request?.json().catch(() => null)) as { email?: unknown } | null;
  const pedido = typeof body?.email === "string" ? body.email.trim() : "";
  if (pedido && !EMAIL_RE.test(pedido)) {
    return NextResponse.json({ error: "El correo de destino no es válido" }, { status: 400 });
  }
  const destinoCliente = pedido || who.email;

  const orderId = `PRUEBA-${Date.now().toString(36).toUpperCase()}`;
  const data: PedidoPagadoData = {
    orderId,
    contact: { name: "Cliente de Prueba", email: destinoCliente, phone: "3000000000" },
    shipping: {
      address: "Calle 100 # 15-20, apto 301",
      city: "Bogotá",
      department: "Bogotá D.C.",
      notes: "Correo de prueba — no es un pedido real",
    },
    totals: { subtotal: 78000, discount: 0, shipping: 11000, total: 89000 },
    lines: [{ title: "Kit inicial de botellón 19 lts", quantity: 1, line_total: 78000 }],
  };

  const interno = renderPedidoPagado(data);
  const cliente = renderPedidoConfirmacion(data);
  const destinatarios = destinatariosPedidos(process.env.CORREO_PEDIDOS);

  const [resInterno, resCliente] = await Promise.all([
    enviarCorreo({
      to: destinatarios,
      subject: `[PRUEBA] ${interno.subject}`,
      html: interno.html,
      reference: orderId,
    }),
    enviarCorreo({
      to: destinoCliente,
      subject: `[PRUEBA] ${cliente.subject}`,
      html: cliente.html,
      reference: `${orderId}-cliente`,
    }),
  ]);

  return NextResponse.json({
    pedidoDePrueba: orderId,
    avisoInterno: { a: destinatarios, ...describe(resInterno) },
    confirmacionCliente: { a: destinoCliente, ...describe(resCliente) },
  });
}
