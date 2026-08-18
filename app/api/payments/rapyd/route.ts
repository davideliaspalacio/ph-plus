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
import {
  getRapydConfig,
  getRequestOrigin,
  rapydRequest,
  sanitizeRapydReference,
} from "@/app/lib/rapyd-server";
import { getShippingDestination } from "@/app/lib/shipping-rates";

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

const rapydRequestSchema = z.object({
  items: z.array(itemSchema).min(1),
  contact: contactSchema,
  shipping: shippingSchema,
  customerType: z.enum(["authenticated", "guest"]).default("guest"),
});

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

type RapydCheckoutData = {
  id: string;
  redirect_url: string;
  status: string;
};

export async function POST(request: Request) {
  const parsed = rapydRequestSchema.safeParse(await request.json().catch(() => null));

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
    config = getRapydConfig();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Rapyd no está configurado correctamente",
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
      "rapyd",
      userId,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo preparar la orden para Rapyd",
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
    paymentMethod: "rapyd",
    itemsSummary: buildItemsSummary(summary),
  });

  const origin = getRequestOrigin(request);
  const referenceId = sanitizeRapydReference(orderId);
  const description = truncate(`Pedido PH PLUS ${referenceId}`, 255);

  // Hosted Checkout Page: el procesamiento de los datos sensibles de la
  // tarjeta ocurre en el entorno de Rapyd, no en nuestro servidor.
  let checkout: RapydCheckoutData;
  try {
    checkout = await rapydRequest<RapydCheckoutData>(config, "post", "/v1/checkout", {
      amount: summary.total,
      currency: config.currency,
      country: config.country,
      merchant_reference_id: referenceId,
      description,
      // Nombres confirmados contra la cuenta real (no coinciden con los que
      // documenta la página pública de Rapyd para otras cuentas/versiones):
      // Rapyd exige "complete_url"/"cancel_url" y rechaza el request si no
      // están, con un mensaje explícito de qué campo falta.
      complete_url: `${origin}/checkout/rapyd/respuesta?orderId=${encodeURIComponent(orderId)}&outcome=success`,
      error_url: `${origin}/checkout/rapyd/respuesta?orderId=${encodeURIComponent(orderId)}&outcome=error`,
      cancel_url: `${origin}/checkout/rapyd/respuesta?orderId=${encodeURIComponent(orderId)}&outcome=cancel`,
      metadata: {
        orderId,
        customerType: parsed.data.customerType,
      },
      customer_email: parsed.data.contact.email,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear la página de pago con Rapyd",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    redirectUrl: checkout.redirect_url,
    checkoutId: checkout.id,
    orderId,
    referenceId,
    persisted: isSupabaseOrderPersistenceEnabled(),
  });
}
