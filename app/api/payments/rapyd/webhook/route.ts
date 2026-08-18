import { NextResponse } from "next/server";

import type { OrderStatus } from "@/src/features/orders";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";
import {
  buildRapydWebhookSignature,
  getRapydConfig,
  getRequestOrigin,
  hashWebhookBody,
} from "@/app/lib/rapyd-server";

export const runtime = "nodejs";

/**
 * Webhook de Rapyd. Fuente de verdad del estado de pago: la página de
 * retorno del checkout NUNCA marca una orden como pagada por sí sola, sólo
 * este endpoint lo hace, y sólo tras validar la firma.
 *
 * Idempotencia: cada evento trae `id` (o se deriva un hash del body si no
 * viene). Antes de aplicar cualquier cambio, chequeamos si ese id ya fue
 * procesado para esa orden (guardado en `orders.payment.processedEventIds`)
 * y si es así, respondemos 200 sin volver a tocar nada — así un reintento de
 * Rapyd no duplica efectos ni pisa un estado más avanzado.
 */

type RapydWebhookBody = {
  id?: string;
  type?: string;
  data?: {
    id?: string;
    status?: string;
    merchant_reference_id?: string;
    metadata?: { orderId?: string } | null;
    payment?: {
      id?: string;
      status?: string;
      merchant_reference_id?: string;
      metadata?: { orderId?: string } | null;
    };
  };
};

function statusFromRapydEvent(type: string | undefined): OrderStatus | null {
  switch (type) {
    // Único evento que consideramos "pago recibido" de verdad — algunos
    // métodos (PSE, 3DS) pasan por PAYMENT_SUCCEEDED sin que los fondos
    // estén confirmados todavía.
    case "PAYMENT_COMPLETED":
      return "paid";
    case "PAYMENT_FAILED":
    case "PAYMENT_DECLINED":
      return "cancelled";
    case "PAYMENT_CANCELED":
    case "PAYMENT_CANCELLED":
    case "PAYMENT_EXPIRED":
    case "CHECKOUT_EXPIRED":
      return "cancelled";
    default:
      // PAYMENT_SUCCEEDED, CHECKOUT_UPDATED y cualquier evento no mapeado se
      // registran (ver order_notes) pero NO cambian el status de la orden.
      return null;
  }
}

/**
 * Busca el orderId en TODAS las formas en que Rapyd puede mandarlo, según el
 * tipo de evento: para eventos de pago (PAYMENT_*) `data` suele ser el
 * objeto Payment directamente (campos "planos"); para otros, `data` es el
 * objeto Checkout con el Payment anidado en `data.payment`. Probamos ambas
 * formas — nunca confirmado contra tráfico real de Rapyd (la cuenta todavía
 * no tuvo un webhook real disparado), así que se cubre defensivamente en vez
 * de asumir una sola forma.
 */
function findOrderId(body: RapydWebhookBody): string | null {
  return (
    body.data?.metadata?.orderId ||
    body.data?.merchant_reference_id ||
    body.data?.payment?.metadata?.orderId ||
    body.data?.payment?.merchant_reference_id ||
    null
  );
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const salt = request.headers.get("salt");
  const timestamp = request.headers.get("timestamp");
  const signature = request.headers.get("signature");

  if (!salt || !timestamp || !signature) {
    return new NextResponse("Missing signature headers", { status: 401 });
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

  // La firma de webhook usa la URL ABSOLUTA completa configurada para
  // recibirlos (no sólo el path) — a diferencia de la firma de requests.
  const absoluteUrl = `${getRequestOrigin(request)}/api/payments/rapyd/webhook`;
  const expected = buildRapydWebhookSignature({
    absoluteUrl,
    salt,
    timestamp,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    bodyString: rawBody,
  });

  if (expected !== signature) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  let body: RapydWebhookBody;
  try {
    body = JSON.parse(rawBody) as RapydWebhookBody;
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const eventId = body.id || `hash:${hashWebhookBody(rawBody)}`;
  const orderId = await findOrderId(body);

  // Sin forma de saber a qué orden corresponde: confirmamos recepción (para
  // que Rapyd no reintente indefinidamente) pero no hay nada que actualizar.
  // Se loguea el body completo (visible en `vercel logs`) porque si esto
  // pasa con tráfico real es la única forma de ver qué forma tiene el
  // payload real de Rapyd y ajustar `findOrderId`.
  if (!orderId) {
    console.error(
      `[rapyd-webhook] No se pudo resolver el orderId. type=${body.type ?? "N/A"} body=${rawBody}`,
    );
    return NextResponse.json({ received: true, matched: false });
  }

  if (
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ received: true, persisted: false });
  }

  const supabase = await createSupabaseServiceClient();

  const { data: orderRow, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json(
      { error: `No se pudo leer la orden ${orderId}: ${fetchError.message}` },
      { status: 500 },
    );
  }

  if (!orderRow) {
    // Orden no encontrada: puede ser un reintento tardío de una orden ya
    // limpiada, o un ambiente cruzado (sandbox pegándole a prod). No es un
    // error del webhook en sí — devolvemos 200 para que Rapyd no reintente.
    console.error(
      `[rapyd-webhook] orderId "${orderId}" resuelto pero no existe en la DB. type=${body.type ?? "N/A"}`,
    );
    return NextResponse.json({ received: true, matched: false });
  }

  const order = orderRow as { status: OrderStatus; payment: unknown };
  const currentPayment = (order.payment ?? {}) as Record<string, unknown>;
  const processedEventIds = Array.isArray(currentPayment.processedEventIds)
    ? (currentPayment.processedEventIds as string[])
    : [];

  if (processedEventIds.includes(eventId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const nextStatus = statusFromRapydEvent(body.type);
  const currentStatus = order.status;

  // Sólo aplicamos la transición si es válida (evita, por ejemplo, que un
  // webhook viejo reabra o "des-pague" una orden que ya avanzó de estado).
  const shouldTransition =
    nextStatus !== null &&
    (currentStatus === "pending_payment" || currentStatus === "draft") &&
    nextStatus !== currentStatus;

  const nextPayment = {
    ...currentPayment,
    method: "rapyd",
    provider: "rapyd",
    merchantReferenceId: body.data?.merchant_reference_id,
    rapydPaymentId: body.data?.payment?.id,
    lastEventType: body.type,
    lastEventStatus: body.data?.status || body.data?.payment?.status,
    processedEventIds: [...processedEventIds, eventId].slice(-50),
  };

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      ...(shouldTransition ? { status: nextStatus } : {}),
      payment: nextPayment,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", orderId);

  if (updateError) {
    return NextResponse.json(
      { error: `No se pudo actualizar la orden ${orderId}: ${updateError.message}` },
      { status: 500 },
    );
  }

  await supabase.from("order_notes").insert({
    order_id: orderId,
    author: "Rapyd",
    text: `Webhook Rapyd: tipo ${body.type ?? "N/A"}, estado ${
      body.data?.status || body.data?.payment?.status || "N/A"
    }${shouldTransition ? ` → orden marcada como "${nextStatus}"` : " (sin cambio de estado)"}.`,
  } as never);

  return NextResponse.json({ received: true, matched: true, applied: shouldTransition });
}
