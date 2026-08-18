import { NextResponse } from "next/server";
import { z } from "zod";

import { resolveAuthenticatedUserId } from "@/app/lib/auth-server";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

export const runtime = "nodejs";

/**
 * Seguimiento de pedido para compradores sin cuenta (guest checkout).
 *
 * `orders.user_id` puede ser null (compra como invitado), así que la única
 * forma de que alguien vea SU pedido sin loguearse es demostrar que conoce
 * el orderId (que ya de por sí es un nanoid de 8 chars, ~48 bits de
 * entropía) Y el email con el que compró. Si está logueado y el pedido es
 * suyo (`user_id` coincide), no hace falta el email.
 *
 * Deliberadamente devuelve poca info: ni dirección completa ni teléfono,
 * sólo lo necesario para confirmar "sí, tu pedido está en tal estado".
 */
const bodySchema = z.object({
  orderId: z.string().min(1).max(40),
  email: z.string().email().optional(),
});

const GENERIC_NOT_FOUND = {
  error: "No encontramos un pedido con esos datos. Revisa el número y el email.",
};

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const { orderId, email } = parsed.data;

  if (
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "El seguimiento de pedidos no está disponible en este ambiente" },
      { status: 503 },
    );
  }

  const supabase = await createSupabaseServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("id, status, contact, shipping, totals, tracking_number, created_at, user_id")
    .eq("id", orderId)
    .maybeSingle();

  const order = data as {
    id: string;
    status: string;
    contact: { name?: string; email?: string } | null;
    shipping: { city?: string } | null;
    totals: { total?: number } | null;
    tracking_number: string | null;
    created_at: string;
    user_id: string | null;
  } | null;

  // Mismo mensaje genérico exista o no el pedido — no le damos a un
  // atacante forma de distinguir "orderId inválido" de "email incorrecto".
  if (!order) {
    return NextResponse.json(GENERIC_NOT_FOUND, { status: 404 });
  }

  const userId = order.user_id ? await resolveAuthenticatedUserId() : null;
  const ownedByCaller = Boolean(order.user_id) && userId === order.user_id;

  if (!ownedByCaller) {
    const givenEmail = email?.trim().toLowerCase();
    const orderEmail = order.contact?.email?.trim().toLowerCase();
    if (!givenEmail || !orderEmail || givenEmail !== orderEmail) {
      return NextResponse.json(GENERIC_NOT_FOUND, { status: 404 });
    }
  }

  const { data: lineRows } = await supabase
    .from("order_lines")
    .select("title, quantity, line_total")
    .eq("order_id", orderId);

  return NextResponse.json({
    id: order.id,
    status: order.status,
    createdAt: order.created_at,
    total: order.totals?.total ?? 0,
    trackingNumber: order.tracking_number,
    contactName: order.contact?.name ?? null,
    city: order.shipping?.city ?? null,
    lines: (lineRows ?? []).map((l) => {
      const line = l as { title: string; quantity: number; line_total: number };
      return { title: line.title, quantity: line.quantity, total: line.line_total };
    }),
  });
}
