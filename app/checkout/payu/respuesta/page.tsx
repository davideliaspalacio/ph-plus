import Link from "next/link";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import {
  createPayuConfirmationSignature,
  getPayuConfig,
  verifySignature,
} from "@/app/lib/payu-server";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function statusCopy(transactionState: string, lapState: string) {
  if (transactionState === "4" || lapState === "APPROVED") {
    return {
      tone: "success",
      title: "Pago aprobado",
      message:
        "Gracias por tu compra. PayU aprobó el pago y nuestro equipo continuará con el despacho.",
    };
  }
  if (transactionState === "6" || lapState === "DECLINED") {
    return {
      tone: "danger",
      title: "Pago rechazado",
      message:
        "PayU rechazó la transacción. Puedes intentar nuevamente o escribirnos por WhatsApp.",
    };
  }
  if (transactionState === "7" || lapState === "PENDING") {
    return {
      tone: "warning",
      title: "Pago pendiente",
      message:
        "PayU dejó el pago en validación. Te avisaremos cuando la transacción tenga estado final.",
    };
  }
  return {
    tone: "neutral",
    title: "Resultado recibido",
    message:
      "Recibimos la respuesta de PayU. Si tienes dudas, escríbenos y revisamos la transacción.",
  };
}

function roundHalfEvenOneDecimal(value: string): string {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return value;
  const scaled = numberValue * 10;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  let rounded = Math.round(scaled);
  if (Math.abs(diff - 0.5) < Number.EPSILON) {
    rounded = floor % 2 === 0 ? floor : floor + 1;
  }
  return (rounded / 10).toFixed(1);
}

function validateResponseSignature(params: {
  merchantId: string;
  referenceCode: string;
  txValue: string;
  currency: string;
  transactionState: string;
  signature: string;
}): boolean | null {
  if (
    !params.merchantId ||
    !params.referenceCode ||
    !params.txValue ||
    !params.currency ||
    !params.transactionState ||
    !params.signature
  ) {
    return null;
  }

  try {
    const config = getPayuConfig();
    const calculated = createPayuConfirmationSignature({
      apiKey: config.apiKey,
      merchantId: params.merchantId,
      referenceSale: params.referenceCode,
      value: roundHalfEvenOneDecimal(params.txValue),
      currency: params.currency,
      statePol: params.transactionState,
    });
    return verifySignature(params.signature, calculated);
  } catch {
    return null;
  }
}

export default async function PayuResponsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const transactionState = firstParam(params.transactionState);
  const lapState = firstParam(params.lapTransactionState);
  const referenceCode = firstParam(params.referenceCode);
  const transactionId = firstParam(params.transactionId);
  const value = firstParam(params.TX_VALUE);
  const currency = firstParam(params.currency);
  const message = firstParam(params.message);
  const signatureStatus = validateResponseSignature({
    merchantId: firstParam(params.merchantId),
    referenceCode,
    txValue: value,
    currency,
    transactionState,
    signature: firstParam(params.signature),
  });
  const copy = statusCopy(transactionState, lapState);
  const toneClass =
    copy.tone === "success"
      ? "bg-whatsapp text-white"
      : copy.tone === "danger"
        ? "bg-red-600 text-white"
        : copy.tone === "warning"
          ? "bg-yellow-400 text-[#1e3a8a]"
          : "bg-[#eef0ff] text-[#1e3a8a]";

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="rounded-3xl border border-card-border bg-[#fafbfd] p-6 text-center shadow-[0_12px_32px_rgba(27,34,166,0.08)] sm:p-8">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-[28px] font-black ${toneClass}`}
            >
              {copy.tone === "success" ? "✓" : copy.tone === "danger" ? "!" : "…"}
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
                  Referencia
                </dt>
                <dd className="mt-1 break-words text-ink">{referenceCode || "N/A"}</dd>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <dt className="font-semibold uppercase tracking-wide text-brand">
                  Transacción PayU
                </dt>
                <dd className="mt-1 break-words text-ink">{transactionId || "N/A"}</dd>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <dt className="font-semibold uppercase tracking-wide text-brand">
                  Valor
                </dt>
                <dd className="mt-1 text-ink">
                  {value ? `${currency} ${value}` : "N/A"}
                </dd>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <dt className="font-semibold uppercase tracking-wide text-brand">
                  Validación
                </dt>
                <dd className="mt-1 text-ink">
                  {signatureStatus === true
                    ? "Firma verificada"
                    : signatureStatus === false
                      ? "Firma no válida"
                      : "Pendiente"}
                </dd>
              </div>
            </dl>

            {message && (
              <p className="mx-auto mt-5 max-w-xl rounded-2xl bg-white px-4 py-3 text-[13px] text-ink-muted">
                {message}
              </p>
            )}

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
