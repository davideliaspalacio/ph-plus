import Link from "next/link";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";
import { ClearCartOnPaid } from "./ClearCartOnPaid";
import { PendingPaymentWatcher } from "./PendingPaymentWatcher";

type PageProps = {
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

type AuthoritativeOrder = { status: string; lastEventType: string | null } | null;

/**
 * El único lugar que decide si un pedido está pagado es la orden en DB,
 * actualizada por el webhook (/api/payments/rapyd/webhook) tras validar la
 * firma de Rapyd. Esta página NUNCA marca nada como pagado por sí sola — el
 * parámetro `outcome` de la URL sólo describe a dónde nos redirigió Rapyd, y
 * sólo se usa para matizar el mensaje mientras la orden sigue pendiente
 * (nunca para decidir si está pagada).
 *
 * Devuelve `undefined` cuando no hay forma de consultar (Supabase
 * deshabilitado — dev/mock), y `null` cuando SÍ se pudo consultar pero la
 * orden no existe (id inválido/viejo) — son casos distintos y el mensaje
 * debe distinguirlos.
 */
async function getAuthoritativeOrder(
  orderId: string,
): Promise<AuthoritativeOrder | undefined> {
  if (
    !orderId ||
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return undefined;
  }

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
      lastEventType:
        typeof payment.lastEventType === "string" ? payment.lastEventType : null,
    };
  } catch {
    return null;
  }
}

function cancelledMessage(lastEventType: string | null): string {
  if (lastEventType === "PAYMENT_FAILED" || lastEventType === "PAYMENT_DECLINED") {
    return "Rapyd rechazó el pago (la entidad no lo aprobó). Puedes intentar con otro medio de pago o escribirnos por WhatsApp.";
  }
  if (lastEventType === "PAYMENT_EXPIRED") {
    return "La sesión de pago expiró antes de completarse. Puedes intentar nuevamente.";
  }
  return "El pago de esta orden no se completó. Puedes intentar nuevamente o escribirnos por WhatsApp.";
}

function resolveCopy(order: AuthoritativeOrder | undefined, outcome: string): Copy {
  // Supabase deshabilitado (dev/mock): no hay forma de verificar nada, se
  // avisa explícitamente en vez de fingir una confirmación.
  if (order === undefined) {
    if (outcome === "cancel") {
      return {
        tone: "neutral",
        title: "Pago cancelado",
        message: "Cancelaste el proceso de pago antes de terminarlo.",
        showRetry: true,
        poll: false,
      };
    }
    return {
      tone: "warning",
      title: "Redirigido desde Rapyd",
      message:
        outcome === "success"
          ? "Rapyd te redirigió como pago exitoso, pero este ambiente no tiene forma de verificarlo contra la orden real (Supabase deshabilitado)."
          : "Rapyd te redirigió como pago no exitoso, pero este ambiente no tiene forma de verificarlo contra la orden real (Supabase deshabilitado).",
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
        "Confirmamos tu pago con Rapyd. Nuestro equipo continuará con el despacho de tu pedido.",
      showRetry: false,
      poll: false,
    };
  }

  if (order.status === "cancelled") {
    return {
      tone: "danger",
      title: "Pago no completado",
      message: cancelledMessage(order.lastEventType),
      showRetry: true,
      poll: false,
    };
  }

  // pending_payment / draft: todavía no llegó (o no va a llegar) el webhook.
  if (outcome === "cancel") {
    return {
      tone: "neutral",
      title: "Cancelaste el pago",
      message:
        "No completaste el pago en Rapyd. Tu carrito sigue intacto — puedes retomarlo cuando quieras.",
      showRetry: true,
      poll: false,
    };
  }
  if (outcome === "error") {
    return {
      tone: "danger",
      title: "El pago no se completó",
      message:
        "Rapyd no pudo procesar el pago. Puedes intentar nuevamente; tu carrito sigue intacto.",
      showRetry: true,
      poll: true,
    };
  }
  return {
    tone: "warning",
    title: "Confirmando tu pago…",
    message:
      "Todavía estamos esperando la confirmación de Rapyd. Esto suele tardar unos segundos — no hace falta que vuelvas a pagar ni recargues la página, se actualiza sola.",
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

export default async function RapydResponsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = firstParam(params.orderId);
  const outcome = firstParam(params.outcome);

  const order = await getAuthoritativeOrder(orderId);
  const copy = resolveCopy(order, outcome);
  const statusLabel =
    order === undefined
      ? "Sin verificar (Supabase deshabilitado)"
      : order === null
        ? "Pedido no encontrado"
        : order.status;

  return (
    <>
      <Header />
      {order && <ClearCartOnPaid paid={order.status === "paid"} />}
      {copy.poll && order && (
        <PendingPaymentWatcher orderId={orderId} initialStatus={order.status} />
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
                  podés consultar su estado más tarde acá
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
