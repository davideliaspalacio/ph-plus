import { NextResponse } from "next/server";
import { z } from "zod";

import { resolveAuthenticatedUserId } from "@/app/lib/auth-server";
import { buildCartSummaryServer } from "@/app/lib/cart-summary-server";
import { syncOrderToHubspot } from "@/app/lib/hubspot-server";
import { isMinimumOrderSubtotal, MIN_ORDER_VALUE } from "@/app/lib/order-rules";
import {
  buildItemsSummary,
  isSupabaseOrderPersistenceEnabled,
  persistPendingOrder,
} from "@/app/lib/orders-server";
import { getShippingDestination } from "@/app/lib/shipping-rates";
import { attachWompiLink } from "@/app/lib/wompi-orders";
import {
  createPaymentLink,
  getRequestOrigin,
  getWompiConfig,
  toCents,
} from "@/app/lib/wompi-server";

export const runtime = "nodejs";

const itemSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().positive().max(99),
});

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
});

const shippingSchema = z.object({
  address: z.string().min(3).max(120),
  city: z.string().min(2).max(80),
  department: z.string().max(80).optional().default(""),
  notes: z.string().max(500).optional().default(""),
});

const wompiRequestSchema = z.object({
  items: z.array(itemSchema).min(1),
  contact: contactSchema,
  shipping: shippingSchema,
  customerType: z.enum(["authenticated", "guest"]).default("guest"),
});

/** El link deja de aceptar pagos pasadas estas horas (el carrito sigue intacto). */
const LINK_TTL_HOURS = 2;

export async function POST(request: Request) {
  const parsed = wompiRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de checkout inválidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const destination = getShippingDestination(parsed.data.shipping.city);
  if (!destination) {
    return NextResponse.json(
      { error: "Selecciona una ciudad válida para calcular el envío" },
      { status: 400 },
    );
  }
  const shipping = {
    ...parsed.data.shipping,
    city: destination.label,
    department: destination.department,
  };

  // Precios desde la DB (fuente de verdad). Si la lectura falla cortamos: cobrar
  // un importe de una fuente desactualizada es peor que no cobrar.
  let summary;
  try {
    summary = await buildCartSummaryServer(parsed.data.items, {
      shippingCost: destination.cost,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron resolver los precios del carrito",
      },
      { status: 500 },
    );
  }

  if (summary.lines.length === 0 || summary.total <= 0) {
    return NextResponse.json(
      { error: "El carrito no tiene productos válidos" },
      { status: 400 },
    );
  }

  if (!isMinimumOrderSubtotal(summary.subtotal)) {
    return NextResponse.json(
      {
        error: `La compra mínima es ${MIN_ORDER_VALUE} COP en productos, sin incluir domicilio`,
      },
      { status: 400 },
    );
  }

  let config;
  try {
    config = getWompiConfig();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Wompi no está configurado correctamente",
      },
      { status: 500 },
    );
  }

  // Resuelto contra la cookie de sesión real, no contra `customerType` (que
  // sólo lo manda el cliente para mostrar copy — no es una fuente confiable
  // de identidad).
  const userId = await resolveAuthenticatedUserId();

  let orderId: string;
  try {
    orderId = await persistPendingOrder(
      { ...parsed.data, shipping },
      summary,
      "wompi",
      userId,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo preparar la orden para Wompi",
      },
      { status: 500 },
    );
  }

  // Sincroniza contacto + negocio a HubSpot. Fail-safe: nunca tira, así que un
  // fallo del CRM no impide continuar al pago.
  await syncOrderToHubspot({
    orderId,
    contact: {
      name: parsed.data.contact.name,
      email: parsed.data.contact.email,
      phone: parsed.data.contact.phone,
      city: shipping.city,
      address: shipping.address,
    },
    amount: summary.total,
    paymentMethod: "wompi",
    itemsSummary: buildItemsSummary(summary),
  });

  const origin = getRequestOrigin(request);

  let link;
  try {
    link = await createPaymentLink(config, {
      name: `Pedido PH PLUS ${orderId}`,
      description: `Pedido ${orderId}: ${buildItemsSummary(summary)}`,
      amountInCents: toCents(summary.total),
      // El orderId va en el PATH y no en el query: Wompi vuelve a esta URL
      // agregando `?id=<transacción>` y así no se mezclan los dos query strings.
      redirectUrl: `${origin}/checkout/wompi/respuesta/${encodeURIComponent(orderId)}`,
      expiresAt: new Date(Date.now() + LINK_TTL_HOURS * 3_600_000).toISOString(),
    });
    await attachWompiLink(orderId, link.id);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear la página de pago con Wompi",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    redirectUrl: link.url,
    checkoutId: link.id,
    orderId,
    referenceId: orderId,
    persisted: isSupabaseOrderPersistenceEnabled(),
  });
}
