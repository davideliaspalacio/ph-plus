"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { formatCOP, formatDate } from "@/src/shared/lib/format";

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  pending_payment: "Pendiente de pago",
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  closed: "Cerrado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_TONE_CLASS: Record<string, string> = {
  draft: "bg-[#eef0ff] text-brand",
  pending_payment: "bg-yellow-100 text-yellow-800",
  paid: "bg-[#e6f7ee] text-emerald-700",
  preparing: "bg-[#e6f7ee] text-emerald-700",
  shipped: "bg-[#eef0ff] text-brand",
  delivered: "bg-[#e6f7ee] text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-red-50 text-red-700",
};

type LookupResult = {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  trackingNumber: string | null;
  contactName: string | null;
  city: string | null;
  lines: Array<{ title: string; quantity: number; total: number }>;
};

export default function PedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = use(params);

  const [order, setOrder] = useState<LookupResult | null>(null);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function lookup(withEmail?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          ...(withEmail ? { email: withEmail } : {}),
        }),
      });
      if (res.ok) {
        setOrder((await res.json()) as LookupResult);
        setNeedsEmail(false);
        return;
      }
      if (res.status === 404) {
        // Puede ser: (a) todavía no probamos con email — pedile el email, o
        // (b) ya lo probamos y no coincidió — mostrale el error.
        if (withEmail) {
          setError("No encontramos un pedido con esos datos. Revisa el número y el email.");
        }
        setNeedsEmail(true);
        return;
      }
      setError("No pudimos consultar el pedido. Intenta de nuevo en un momento.");
    } catch {
      setError("No pudimos consultar el pedido. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Primer intento sin email: si el visitante está logueado y el pedido es
    // suyo, esto ya alcanza — no le pedimos nada. Se difiere con setTimeout
    // (no se llama sincrónicamente en el cuerpo del efecto) para no disparar
    // setState antes del primer `await` dentro del render del efecto.
    let cancelled = false;
    const t = setTimeout(() => {
      if (!cancelled) lookup();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) lookup(email.trim());
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <section className="mx-auto max-w-[680px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <h1 className="text-[24px] font-extrabold text-brand sm:text-[28px]">
            Seguimiento de pedido
          </h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Pedido <span className="font-semibold text-ink">{orderId}</span>
          </p>

          {loading && (
            <p className="mt-8 text-[14px] text-ink-muted">Consultando…</p>
          )}

          {!loading && needsEmail && !order && (
            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-card-border bg-[#fafbfd] p-6"
            >
              <label className="block text-[13px] font-semibold text-brand">
                Confirma el email con el que hiciste la compra
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuemail@ejemplo.com"
                className="mt-2 w-full rounded-lg border border-card-border bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
              {error && (
                <p className="mt-2 text-[12px] font-semibold text-red-600">{error}</p>
              )}
              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-dark"
              >
                Ver estado del pedido
              </button>
            </form>
          )}

          {!loading && error && !needsEmail && (
            <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
              {error}
            </p>
          )}

          {order && (
            <div className="mt-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-card-border bg-white p-5">
                <div>
                  <p className="text-[12px] text-ink-muted">Estado</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-[13px] font-semibold ${
                      STATUS_TONE_CLASS[order.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-ink-muted">Fecha</p>
                  <p className="text-[14px] text-ink">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-card-border bg-white p-5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                  Productos
                </p>
                <ul className="mt-2 space-y-2 text-[13px] text-ink">
                  {order.lines.map((l, i) => (
                    <li key={i} className="flex items-center justify-between gap-3">
                      <span>
                        {l.title} × {l.quantity}
                      </span>
                      <span className="font-semibold">{formatCOP(l.total)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-card-border pt-3">
                  <span className="text-[13px] font-semibold text-ink">Total</span>
                  <span className="text-[16px] font-extrabold text-brand">
                    {formatCOP(order.total)}
                  </span>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="rounded-2xl border border-card-border bg-white p-5">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                    Guía de envío
                  </p>
                  <p className="mt-1 text-[14px] text-ink">{order.trackingNumber}</p>
                </div>
              )}

              {(order.status === "pending_payment" || order.status === "cancelled") && (
                <div className="flex justify-center">
                  <Link
                    href="/checkout"
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-dark"
                  >
                    {order.status === "pending_payment"
                      ? "Completar el pago"
                      : "Volver a intentar"}
                  </Link>
                </div>
              )}
            </div>
          )}

          <p className="mt-10 text-center text-[12px] text-ink-muted">
            ¿Necesitas ayuda?{" "}
            <a
              href="https://wa.me/573234392470"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-whatsapp-dark hover:underline"
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
