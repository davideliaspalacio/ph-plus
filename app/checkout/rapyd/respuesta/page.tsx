import Link from "next/link";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

type Tone = "success" | "danger" | "warning" | "neutral";

type Copy = { tone: Tone; title: string; message: string };

/**
 * El único lugar que decide si un pedido está pagado es la orden en DB,
 * actualizada por el webhook (/api/payments/rapyd/webhook) tras validar la
 * firma de Rapyd. Esta página NUNCA marca nada como pagado por sí sola — el
 * parámetro `outcome` de la URL sólo describe a dónde nos redirigió Rapyd,
 * no el resultado real y verificado del pago.
 */
async function getAuthoritativeOrderStatus(orderId: string): Promise<string | null> {
  if (
    !orderId ||
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }

  try {
    const supabase = await createSupabaseServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();
    return (data as { status?: string } | null)?.status ?? null;
  } catch {
    return null;
  }
}

function copyFromAuthoritativeStatus(status: string): Copy {
  if (status === "paid") {
    return {
      tone: "success",
      title: "Pago confirmado",
      message:
        "Confirmamos tu pago con Rapyd. Nuestro equipo continuará con el despacho de tu pedido.",
    };
  }
  if (status === "cancelled") {
    return {
      tone: "danger",
      title: "Pago no completado",
      message:
        "Rapyd no pudo confirmar el pago de esta orden. Puedes intentar nuevamente o escribirnos por WhatsApp.",
    };
  }
  return {
    tone: "warning",
    title: "Verificando tu pago",
    message:
      "Todavía estamos esperando la confirmación de Rapyd. Esto puede tardar unos minutos — no es necesario que vuelvas a pagar.",
  };
}

/** Sólo se usa cuando no hay forma de consultar el estado real (modo mock/dev). */
function copyFromOutcomeParam(outcome: string): Copy {
  if (outcome === "success") {
    return {
      tone: "warning",
      title: "Redirigido desde Rapyd",
      message:
        "Rapyd te redirigió como pago exitoso, pero este ambiente no tiene forma de verificarlo contra la orden real (Supabase deshabilitado). En producción esta pantalla confirma el estado real de la orden, no sólo la redirección.",
    };
  }
  if (outcome === "cancel") {
    return {
      tone: "neutral",
      title: "Pago cancelado",
      message: "Cancelaste el proceso de pago antes de terminarlo.",
    };
  }
  return {
    tone: "danger",
    title: "Pago no completado",
    message:
      "Rapyd te redirigió como pago fallido. Puedes intentar nuevamente o escribirnos por WhatsApp.",
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

  const authoritativeStatus = await getAuthoritativeOrderStatus(orderId);
  const copy = authoritativeStatus
    ? copyFromAuthoritativeStatus(authoritativeStatus)
    : copyFromOutcomeParam(outcome);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="rounded-3xl border border-card-border bg-[#fafbfd] p-6 text-center shadow-[0_12px_32px_rgba(27,34,166,0.08)] sm:p-8">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-[28px] font-black ${TONE_CLASS[copy.tone]}`}
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
                <dd className="mt-1 text-ink">
                  {authoritativeStatus
                    ? "Verificado con la orden"
                    : "Sin verificar (ver webhook)"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
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
