"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { formatCOP } from "../../lib/products";

type OrderPayload = {
  orderId: string;
  contact: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; department: string; notes: string };
  payment: string;
  lines: {
    slug: string;
    title: string;
    quantity: number;
    unit: number;
    total: number;
  }[];
  totals: { subtotal: number; shipping: number; total: number };
  createdAt: string;
};

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const [order, setOrder] = useState<OrderPayload | null>(null);

  useEffect(() => {
    // Diferimos el setState al siguiente tick para evitar el setState
    // sincrónico dentro de un effect (regla react-hooks/set-state-in-effect).
    const id = window.setTimeout(() => {
      try {
        const raw = sessionStorage.getItem("phplus.lastOrder");
        if (raw) setOrder(JSON.parse(raw) as OrderPayload);
      } catch {
        // ignore
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-whatsapp text-white shadow-[0_8px_22px_rgba(37,211,102,0.35)]">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden>
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-[28px] font-extrabold text-brand sm:text-[34px]">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-2 text-[14px] text-ink-muted sm:text-[16px]">
          Gracias por elegir PH PLUS. Te enviaremos la confirmación a tu
          correo y un mensaje por WhatsApp con los detalles de entrega.
        </p>
        {orderId && (
          <p className="mt-4 inline-flex items-center rounded-full bg-[#eef0ff] px-4 py-1.5 text-[13px] font-semibold text-brand">
            Número de pedido: {orderId}
          </p>
        )}
      </div>

      {order && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-card-border bg-white p-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
              Enviaremos a
            </p>
            <p className="mt-2 text-[14px] font-semibold text-ink">
              {order.contact.name}
            </p>
            <p className="mt-1 text-[13px] text-ink-muted">
              {order.shipping.address}
              <br />
              {order.shipping.city}, {order.shipping.department}
            </p>
            <p className="mt-3 text-[12px] text-ink-muted">
              {order.contact.email} · {order.contact.phone}
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-white p-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
              Resumen
            </p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-ink">
              {order.lines.map((l) => (
                <li key={l.slug} className="flex justify-between gap-3">
                  <span>
                    {l.title} × {l.quantity}
                  </span>
                  <span className="font-semibold">{formatCOP(l.total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-card-border pt-3 text-[13px]">
              <span className="text-ink-muted">Envío</span>
              <span>
                {order.totals.shipping === 0
                  ? "Gratis"
                  : formatCOP(order.totals.shipping)}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[14px] font-semibold">Total</span>
              <span className="text-[20px] font-extrabold text-brand">
                {formatCOP(order.totals.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href="https://wa.me/573234392470"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(37,211,102,0.35)] transition-transform hover:scale-[1.03] hover:bg-whatsapp-dark"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5"
          />
          Confirmar por WhatsApp
        </a>
        <Link
          href="/#productos"
          className="inline-flex items-center justify-center rounded-full border border-brand px-6 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:px-12">
              <div className="skeleton mx-auto h-20 w-20 rounded-full" />
              <div className="skeleton mx-auto mt-6 h-8 w-72 rounded" />
              <div className="skeleton mx-auto mt-3 h-4 w-60 rounded" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
