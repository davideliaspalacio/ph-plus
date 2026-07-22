import { NextResponse } from "next/server";
import { z } from "zod";

import { buildCartSummaryServer } from "@/app/lib/cart-summary-server";
import { syncOrderToHubspot } from "@/app/lib/hubspot-server";
import {
  buildItemsSummary,
  isSupabaseOrderPersistenceEnabled,
  persistPendingOrder,
} from "@/app/lib/orders-server";
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

const orderRequestSchema = z.object({
  items: z.array(itemSchema).min(1),
  contact: contactSchema,
  shipping: shippingSchema,
  customerType: z.enum(["authenticated", "guest"]).default("guest"),
});

/**
 * Registra un pedido de pago **contra entrega** (no pasa por PayU) y lo
 * sincroniza a HubSpot. Persiste en Supabase si está habilitado; si no, sólo
 * genera el orderId y hace el sync de CRM.
 */
export async function POST(request: Request) {
  const parsed = orderRequestSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de pedido inválidos", issues: parsed.error.flatten() },
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

  // Precios desde la DB (fuente de verdad), igual que en el flujo de PayU.
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

  let orderId: string;
  try {
    orderId = await persistPendingOrder(
      { ...parsed.data, shipping },
      summary,
      "cash_on_delivery",
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo registrar el pedido",
      },
      { status: 500 },
    );
  }

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
    paymentMethod: "cash_on_delivery",
    itemsSummary: buildItemsSummary(summary),
  });

  return NextResponse.json({
    orderId,
    persisted: isSupabaseOrderPersistenceEnabled(),
  });
}
