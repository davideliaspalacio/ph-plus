import Link from "next/link";
import { after } from "next/server";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ClearCartOnPaid } from "@/app/checkout/rapyd/respuesta/ClearCartOnPaid";
import { PendingPaymentWatcher } from "@/app/checkout/rapyd/respuesta/PendingPaymentWatcher";
import { notificarPedidoPagado } from "@/app/lib/correos/pedido-pagado";
import { applyWompiTransaction, isOrderPersistenceEnabled } from "@/app/lib/wompi-orders";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

type PageProps = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

type Tone = "success" | "danger" | "warning" | "neutral";

type Copy = {
  tone: Tone;
  title: string;
  message: string;
  showRetry: boolean;
  poll: boolean;
};

type AuthoritativeOrder = { status: string; lastEventStatus: string | null } | null;

/**
 * Wompi nos devuelve acá agregando `?id=<transacción>`. Ese id NO decide nada
 * por sí solo: `applyWompiTransaction` lo re-consulta a Wompi con nuestra llave,
 * comprueba que pertenezca a esta orden y que el monto coincida, y recién ahí
 * actualiza la orden. Esta página sólo muestra lo que quedó en la DB.
 *
 * Devuelve `undefined` si no hay cómo consultar (Supabase deshabilitado —
 * dev/mock) y `null` si se pudo consultar pero la orden no existe.
 */
async function getAuthoritativeOrder(
  orderId: string,
): Promise<AuthoritativeOrder | undefined> {
  if (!orderId || !isOrderPersistenceEnabled()) return undefined;

  try {
    const supabase = await createSupabaseServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("status, payment")
      .eq("id", orderId)
      .maybeSingle();
    const row = data as { status?: string; payment?: unknown } | null;
    if (!row?.status) return null;
    const payment = (row.payment ?? {}) as Record<string, unknown>;
    return {
      status: row.status,
      lastEventStatus:
        typeof payment.lastEventStatus === "string" ? payment.lastEventStatus : null,
    };
  } catch {
    return null;
  }
}

function cancelledMessage(lastEventStatus: string | null): string {
  if (lastEventStatus === "DECLINED") {
    return "Wompi informó que el pago fue rechazado (la entidad no lo aprobó). Puedes intentar con otro medio de pago o escribirnos por WhatsApp.";
  }
  if (lastEventStatus === "VOIDED") {
    return "El pago fue anulado. Puedes intentar nuevamente o escribirnos por WhatsApp.";
  }
  return "El pago de esta orden no se completó. Puedes intentar nuevamente o escribirnos por WhatsApp.";
}

function resolveCopy(order: AuthoritativeOrder | undefined): Copy {
  if (order === undefined) {
    return {
      tone: "warning",
      title: "Redirigido desde Wompi",
      message:
        "Wompi te redirigió de vuelta, pero este ambiente no tiene forma de verificar el pago contra la orden real (Supabase deshabilitado).",
      showRetry: true,
      poll: false,
    };
  }

  if (order === null) {
    return {
      tone: "danger",
      title: "No encontramos ese pedido",
      message:
        "El enlace de retorno no corresponde a ningún pedido válido. Si acabas de pagar, escríbenos por WhatsApp con tu comprobante.",
      showRetry: false,
      poll: false,
    };
  }

  if (order.status === "paid") {
    return {
      tone: "success",
      title: "Pago confirmado",
      message:
        "Confirmamos tu pago con Wompi. Nuestro equipo continuará con el despacho de tu pedido.",
      showRetry: false,
      poll: false,
    };
  }

  if (order.status === "cancelled") {
    return {
      tone: "danger",
      title: "Pago no completado",
      message: cancelledMessage(order.lastEventStatus),
      showRetry: true,
      poll: false,
    };
  }

  // pending_payment / draft: transacción PENDING (p. ej. PSE) o aún sin id.
  return {
    tone: "warning",
    title: "Confirmando tu pago…",
    message:
      "Todavía estamos esperando la confirmación de Wompi. Esto suele tardar unos segundos (con PSE puede tardar un poco más) — no hace falta que vuelvas a pagar ni recargues la página, se actualiza sola.",
    showRetry: false,
    poll: true,
  };
}

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-whatsapp text-white",
  danger: "bg-red-600 text-white",
  warning: "bg-yellow-400 text-[#1e3a8a]",
  neutral: "bg-[#eef0ff] text-[#1e3a8a]",
};

const TONE_ICON: Record<Tone, string> = {
  success: "✓",
  danger: "!",
  warning: "…",
  neutral: "·",
};

export default async function WompiResponsePage({ params, searchParams }: PageProps) {
  const orderId = decodeURIComponent((await params).orderId);
  const transactionId = firstParam((await searchParams).id);

  if (transactionId && isOrderPersistenceEnabled()) {
    try {
      const result = await applyWompiTransaction(transactionId);
      if (result.matched && result.becamePaid) {
        after(() => notificarPedidoPagado(result.orderId));
      }
    } catch (error) {
      // Si Wompi no responde ahora, igual mostramos el estado actual de la
      // orden y el webhook / el polling lo terminan de resolver.
      console.error("[wompi-respuesta]", error);
    }
  }

  const order = await getAuthoritativeOrder(orderId);
  const copy = resolveCopy(order);
  const statusLabel =
    order === undefined
      ? "Sin verificar (Supabase deshabilitado)"
      : order === null
        ? "Pedido no encontrado"
        : order.status;

  const statusUrl = `/api/payments/wompi/status?orderId=${encodeURIComponent(orderId)}${
    transactionId ? `&id=${encodeURIComponent(transactionId)}` : ""
  }`;

  return (
    <>
      <Header />
      {order && <ClearCartOnPaid paid={order.status === "paid"} />}
      {copy.poll && order && (
        <PendingPaymentWatcher
          orderId={orderId}
          initialStatus={order.status}
          statusUrl={statusUrl}
        />
      )}
      <main className="flex-1 bg-white">
        <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="rounded-3xl border border-card-border bg-[#fafbfd] p-6 text-center shadow-[0_12px_32px_rgba(27,34,166,0.08)] sm:p-8">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-[28px] font-black ${TONE_CLASS[copy.tone]} ${copy.poll ? "animate-pulse" : ""}`}
            >
              {TONE_ICON[copy.tone]}
            </div>
            <h1 className="mt-5 text-[28px] font-extrabold text-brand sm:text-[34px]">
              {copy.title}
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-ink-muted sm:text-[16px]">
              {copy.message}
            </p>

            <dl className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 text-left text-[13px] sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <dt className="font-semibold uppercase tracking-wide text-brand">
                  Pedido
                </dt>
                <dd className="mt-1 break-words text-ink">{orderId || "N/A"}</dd>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <dt className="font-semibold uppercase tracking-wide text-brand">
                  Estado
                </dt>
                <dd className="mt-1 text-ink">{statusLabel}</dd>
              </div>
            </dl>

            {orderId && order && (
              <p className="mx-auto mt-4 max-w-xl text-[12px] text-ink-muted">
                Guarda tu número de pedido —{" "}
                <Link
                  href={`/pedido/${encodeURIComponent(orderId)}`}
                  className="font-semibold text-brand hover:underline"
                >
                  puedes consultar su estado más tarde aquí
                </Link>
                .
              </p>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {copy.showRetry && (
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
                >
                  Volver a intentar
                </Link>
              )}
              <Link
                href="/productos"
                className={
                  copy.showRetry
                    ? "inline-flex items-center justify-center rounded-full border border-brand px-6 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                    : "inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
                }
              >
                Seguir comprando
              </Link>
              <a
                href="https://wa.me/573234392470"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-whatsapp px-6 py-3 text-[14px] font-semibold text-whatsapp-dark transition-colors hover:bg-whatsapp hover:text-white"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
