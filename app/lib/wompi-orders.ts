import type { OrderStatus } from "@/src/features/orders";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

import {
  getTransaction,
  getWompiConfig,
  orderStatusFromWompi,
  toCents,
} from "./wompi-server";

/**
 * Aplica a una orden el estado REAL de una transacción de Wompi.
 *
 * Se usa desde el webhook y desde la página de retorno. Nunca confía en lo que
 * dice quien nos llama (URL o body): recibe sólo el id de la transacción, la
 * vuelve a pedir a Wompi con nuestra llave y decide con esa respuesta. Además
 * exige que el link/referencia correspondan a la orden y que el monto cobrado
 * sea exactamente el de la orden — así un id ajeno o un pago de otro valor no
 * marca nada como pagado.
 *
 * Idempotente: cada (transacción, estado) se aplica una sola vez
 * (`payment.processedEventIds`), así un reintento del webhook o recargar la
 * página no duplica notas ni correos.
 */

export type ApplyWompiResult =
  | { matched: false; reason: string }
  | {
      matched: true;
      orderId: string;
      applied: boolean;
      /** True sólo en la transición a `paid`: el llamador dispara el correo. */
      becamePaid: boolean;
      duplicate?: boolean;
    };

export function isOrderPersistenceEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

type OrderRow = {
  id: string;
  status: OrderStatus;
  payment: unknown;
  totals: { total?: number } | null;
};

/** Guarda en la orden el id del Payment Link para poder casar el pago después. */
export async function attachWompiLink(orderId: string, linkId: string): Promise<void> {
  if (!isOrderPersistenceEnabled()) return;
  const supabase = await createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("payment")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error(`No se pudo leer la orden ${orderId}: ${error.message}`);

  const current = ((data as { payment?: unknown } | null)?.payment ?? {}) as Record<
    string,
    unknown
  >;
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment: { ...current, method: "wompi", provider: "wompi", wompiPaymentLinkId: linkId },
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", orderId);
  if (updateError) {
    throw new Error(`No se pudo guardar el link de pago en ${orderId}: ${updateError.message}`);
  }
}

async function findOrder(
  reference: string | null,
  paymentLinkId: string | null,
): Promise<OrderRow | null> {
  const supabase = await createSupabaseServiceClient();

  if (paymentLinkId) {
    const { data } = await supabase
      .from("orders")
      .select("id, status, payment, totals")
      .eq("payment->>wompiPaymentLinkId" as never, paymentLinkId)
      .maybeSingle();
    if (data) return data as unknown as OrderRow;
  }

  // Cobros hechos con Web Checkout (sin link) usan nuestro orderId como referencia.
  if (reference?.startsWith("ORD-")) {
    const { data } = await supabase
      .from("orders")
      .select("id, status, payment, totals")
      .eq("id", reference)
      .maybeSingle();
    if (data) return data as unknown as OrderRow;
  }
  return null;
}

export async function applyWompiTransaction(
  transactionId: string,
): Promise<ApplyWompiResult> {
  if (!isOrderPersistenceEnabled()) {
    return { matched: false, reason: "persistencia deshabilitada" };
  }

  const config = getWompiConfig();
  const tx = await getTransaction(config, transactionId);

  const order = await findOrder(tx.reference, tx.payment_link_id);
  if (!order) {
    console.error(
      `[wompi] transacción ${tx.id} sin orden asociada (link=${tx.payment_link_id ?? "N/A"}, ref=${tx.reference ?? "N/A"})`,
    );
    return { matched: false, reason: "orden no encontrada" };
  }

  const supabase = await createSupabaseServiceClient();
  const payment = (order.payment ?? {}) as Record<string, unknown>;
  const processed = Array.isArray(payment.processedEventIds)
    ? (payment.processedEventIds as string[])
    : [];
  const eventKey = `${tx.id}:${tx.status}`;

  if (processed.includes(eventKey)) {
    return { matched: true, orderId: order.id, applied: false, becamePaid: false, duplicate: true };
  }

  const expectedCents = toCents(order.totals?.total ?? 0);
  const amountMatches = tx.amount_in_cents === expectedCents && tx.currency === "COP";
  const nextStatus = amountMatches ? orderStatusFromWompi(tx.status) : null;

  const shouldTransition =
    nextStatus !== null &&
    // Sólo se avanza desde "sin pagar": un evento viejo no reabre ni "des-paga"
    // una orden que ya avanzó.
    (order.status === "pending_payment" || order.status === "draft");

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      ...(shouldTransition ? { status: nextStatus } : {}),
      payment: {
        ...payment,
        method: "wompi",
        provider: "wompi",
        wompiTransactionId: tx.id,
        wompiPaymentMethod: tx.payment_method_type ?? undefined,
        lastEventType: `wompi.${tx.status}`,
        lastEventStatus: tx.status,
        processedEventIds: [...processed, eventKey].slice(-50),
      },
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", order.id);

  if (updateError) {
    throw new Error(`No se pudo actualizar la orden ${order.id}: ${updateError.message}`);
  }

  await supabase.from("order_notes").insert({
    order_id: order.id,
    author: "Wompi",
    text: !amountMatches
      ? `Wompi: transacción ${tx.id} (${tx.status}) con monto ${tx.amount_in_cents / 100} ${tx.currency} que NO coincide con el total de la orden — no se cambió el estado. Revisar a mano.`
      : `Wompi: transacción ${tx.id} ${tx.status}${
          tx.payment_method_type ? ` (${tx.payment_method_type})` : ""
        }${shouldTransition ? ` → orden marcada como "${nextStatus}"` : " (sin cambio de estado)"}.`,
  } as never);

  return {
    matched: true,
    orderId: order.id,
    applied: shouldTransition,
    becamePaid: shouldTransition && nextStatus === "paid",
  };
}
