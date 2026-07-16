import "server-only";

import { newOrderId } from "@/src/shared/lib/id";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

/**
 * Persistencia de pedidos compartida por los flujos de checkout (PayU y
 * contra-entrega). Si Supabase no está configurado, se genera un orderId en
 * memoria y no se guarda nada (modo mock) — el checkout sigue funcionando.
 */

/**
 * Sólo lo que la persistencia necesita de cada línea. Es estructural a
 * propósito: lo cumple tanto el resumen del server (`buildCartSummaryServer`,
 * con precios de la DB) como el legacy del catálogo hardcodeado.
 */
export type CartSummary = {
  lines: Array<{
    item: { quantity: number };
    product: { slug: string; title: string; priceValue: number };
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderContactInput = {
  name: string;
  email: string;
  phone: string;
};

export type OrderShippingInput = {
  address: string;
  city: string;
  department: string;
  notes?: string;
};

export type PersistOrderInput = {
  contact: OrderContactInput;
  shipping: OrderShippingInput;
};

export type OrderPaymentMethod = "payu" | "cash_on_delivery";

export function isSupabaseOrderPersistenceEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

/**
 * Crea una orden en estado `pending_payment`. Devuelve el orderId (persistido
 * en Supabase cuando está habilitado, o sólo generado en modo mock).
 */
export async function persistPendingOrder(
  input: PersistOrderInput,
  summary: CartSummary,
  method: OrderPaymentMethod,
): Promise<string> {
  const orderId = newOrderId();
  if (!isSupabaseOrderPersistenceEnabled()) return orderId;

  const supabase = await createSupabaseServiceClient();
  const now = new Date().toISOString();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    user_id: null,
    status: "pending_payment",
    contact: input.contact,
    shipping: {
      ...input.shipping,
      postalCode: "",
    },
    payment: {
      method,
      provider: method,
    },
    totals: {
      subtotal: summary.subtotal,
      discount: 0,
      shipping: summary.shipping,
      total: summary.total,
    },
    coupon_code: null,
    tracking_number: null,
    created_at: now,
    updated_at: now,
  } as never);

  if (orderError) {
    throw new Error(`No se pudo crear la orden en Supabase: ${orderError.message}`);
  }

  const lines = summary.lines.map((line) => ({
    order_id: orderId,
    slug: line.product.slug,
    title: line.product.title,
    quantity: line.item.quantity,
    unit_price: line.product.priceValue,
    line_total: line.lineTotal,
  }));

  const { error: linesError } = await supabase
    .from("order_lines")
    .insert(lines as never);

  if (linesError) {
    throw new Error(
      `No se pudieron crear las líneas de la orden: ${linesError.message}`,
    );
  }

  return orderId;
}

/** Resumen de líneas para el `description` del negocio en HubSpot. */
export function buildItemsSummary(summary: CartSummary): string {
  return summary.lines
    .map((line) => `${line.product.title} x${line.item.quantity}`)
    .join(", ");
}
