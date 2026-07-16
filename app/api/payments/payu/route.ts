import { NextResponse } from "next/server";
import { z } from "zod";

import { buildCartSummary } from "@/app/lib/cart-summary";
import { syncOrderToHubspot } from "@/app/lib/hubspot-server";
import {
  buildItemsSummary,
  isSupabaseOrderPersistenceEnabled,
  persistPendingOrder,
} from "@/app/lib/orders-server";
import {
  createPayuCheckoutSignature,
  formatPayuAmount,
  getPayuConfig,
  getRequestOrigin,
  sanitizePayuReference,
  type PayuCheckoutFields,
} from "@/app/lib/payu-server";

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
  department: z.string().min(2).max(80),
  notes: z.string().max(500).optional().default(""),
});

const payuRequestSchema = z.object({
  items: z.array(itemSchema).min(1),
  contact: contactSchema,
  shipping: shippingSchema,
  customerType: z.enum(["authenticated", "guest"]).default("guest"),
});

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export async function POST(request: Request) {
  const parsed = payuRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de checkout inválidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const summary = buildCartSummary(parsed.data.items);
  if (summary.lines.length === 0 || summary.total <= 0) {
    return NextResponse.json(
      { error: "El carrito no tiene productos válidos" },
      { status: 400 },
    );
  }

  let config;
  try {
    config = getPayuConfig();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PayU no está configurado correctamente",
      },
      { status: 500 },
    );
  }

  let orderId: string;
  try {
    orderId = await persistPendingOrder(parsed.data, summary, "payu");
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo preparar la orden para PayU",
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
      city: parsed.data.shipping.city,
      address: parsed.data.shipping.address,
    },
    amount: summary.total,
    paymentMethod: "payu",
    itemsSummary: buildItemsSummary(summary),
  });

  const origin = getRequestOrigin(request);
  const referenceCode = sanitizePayuReference(orderId);
  const amount = formatPayuAmount(summary.total);
  const description = truncate(`Pedido PH PLUS ${referenceCode}`, 255);
  const signature = createPayuCheckoutSignature({
    apiKey: config.apiKey,
    merchantId: config.merchantId,
    referenceCode,
    amount,
    currency: config.currency,
  });

  const fields: PayuCheckoutFields = {
    merchantId: config.merchantId,
    accountId: config.accountId,
    description,
    referenceCode,
    amount,
    tax: "0",
    taxReturnBase: "0",
    currency: config.currency,
    signature,
    algorithmSignature: "MD5",
    test: config.test ? "1" : "0",
    buyerEmail: parsed.data.contact.email,
    payerFullName: truncate(parsed.data.contact.name, 50),
    payerEmail: parsed.data.contact.email,
    payerPhone: truncate(parsed.data.contact.phone, 20),
    telephone: truncate(parsed.data.contact.phone, 20),
    billingCountry: "CO",
    shippingAddress: truncate(parsed.data.shipping.address, 50),
    shippingCity: truncate(parsed.data.shipping.city, 50),
    shippingCountry: "CO",
    responseUrl: `${origin}/checkout/payu/respuesta`,
    confirmationUrl: `${origin}/api/payments/payu/confirmation`,
    extra1: orderId,
    extra2: parsed.data.customerType,
  };

  return NextResponse.json({
    action: config.checkoutUrl,
    fields,
    orderId,
    referenceCode,
    persisted: isSupabaseOrderPersistenceEnabled(),
  });
}
