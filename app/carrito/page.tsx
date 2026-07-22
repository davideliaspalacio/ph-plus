"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductVisual from "../components/ProductVisual";
import { useCart } from "../components/CartProvider";
import { CartLineSkeleton } from "../components/Skeletons";
import { useMockLoading } from "../components/useMockLoading";
import { buildCartSummary } from "../lib/cart-summary";
import { formatCOP } from "../lib/products";
import {
  getShippingDestination,
  SHIPPING_DESTINATION_GROUPS,
} from "../lib/shipping-rates";

const MIN_ORDER_VALUE = 50_000;

function QtyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-card-border">
      <button
        type="button"
        aria-label="Disminuir cantidad"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid h-8 w-8 place-items-center text-[16px] text-brand transition-colors hover:bg-[#eef0ff]"
      >
        −
      </button>
      <span className="min-w-[28px] text-center text-[14px] font-semibold text-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        onClick={() => onChange(value + 1)}
        className="grid h-8 w-8 place-items-center text-[16px] text-brand transition-colors hover:bg-[#eef0ff]"
      >
        +
      </button>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CartPage() {
  const initialLoading = useMockLoading();
  const { items, hydrated, setQuantity, removeItem, clear } = useCart();
  const [shippingCity, setShippingCity] = useState("");
  const selectedShippingDestination = useMemo(
    () => getShippingDestination(shippingCity),
    [shippingCity],
  );
  const summary = useMemo(
    () =>
      buildCartSummary(items, {
        shippingCost: selectedShippingDestination?.cost ?? 0,
      }),
    [items, selectedShippingDestination?.cost],
  );
  const ready = hydrated && !initialLoading;
  const isEmpty = ready && summary.lines.length === 0;
  const checkoutHref = selectedShippingDestination
    ? `/checkout?city=${encodeURIComponent(selectedShippingDestination.value)}`
    : "#shipping-city";

  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <nav className="mx-auto max-w-page px-5 pt-6 text-[12px] text-ink-muted sm:px-8 sm:text-[13px] lg:px-12">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Carrito</span>
        </nav>

        <section className="mx-auto max-w-page px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <h1 className="text-[26px] font-extrabold text-brand sm:text-[32px]">
            Tu carrito
          </h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            Revisa tus productos antes de continuar al pago.
          </p>

          {!ready && (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <CartLineSkeleton key={i} />
                ))}
              </div>
              <div className="skeleton h-80 rounded-2xl" />
            </div>
          )}

          {isEmpty && (
            <div className="mt-10 flex flex-col items-center rounded-3xl border border-card-border bg-[#fafbfd] px-6 py-14 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white">
                <svg viewBox="0 0 48 46" className="h-7 w-7" fill="none" aria-hidden>
                  <path
                    d="M2 2H10L15.36 28.78C15.5429 29.7008 16.0438 30.5279 16.7751 31.1166C17.5064 31.7053 18.4214 32.018 19.36 32H38.8C39.7386 32.018 40.6536 31.7053 41.3849 31.1166C42.1162 30.5279 42.6171 29.7008 42.8 28.78L46 12H12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-5 text-[18px] font-extrabold text-brand">
                Tu carrito está vacío
              </p>
              <p className="mt-2 max-w-md text-[14px] text-ink-muted">
                Explora nuestros productos y empieza a hidratarte con PH PLUS.
              </p>
              <Link
                href="/productos"
                className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
              >
                Ver productos
              </Link>
            </div>
          )}

          {ready && !isEmpty && (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="space-y-4">
                {summary.lines.map(({ item, product, lineTotal }) => (
                  <article
                    key={product.slug}
                    className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-[#f4f5fa]">
                      <ProductVisual
                        visualKey={product.visualKey}
                        className="h-20 w-auto"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-brand">
                        {product.title}
                      </p>
                      <p className="mt-1 text-[13px] text-ink-muted">
                        {formatCOP(product.priceValue)} c/u
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <QtyInput
                          value={item.quantity}
                          onChange={(n) => setQuantity(product.slug, n)}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(product.slug)}
                          aria-label={`Eliminar ${product.title}`}
                          className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted transition-colors hover:text-brand"
                        >
                          <TrashIcon />
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <p className="text-right text-[18px] font-extrabold text-brand sm:min-w-[100px]">
                      {formatCOP(lineTotal)}
                    </p>
                  </article>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/productos"
                    className="text-[13px] font-semibold text-brand hover:underline"
                  >
                    ← Seguir comprando
                  </Link>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-[13px] text-ink-muted hover:text-brand"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>

              <aside className="rounded-2xl border border-card-border bg-[#fafbfd] p-6">
                <div
                  id="shipping-city"
                  className="rounded-2xl border border-brand/20 bg-white p-4"
                >
                  <label
                    htmlFor="cart-shipping-city"
                    className="block text-[13px] font-extrabold uppercase tracking-wide text-brand"
                  >
                    SELECCIONA TU CIUDAD PARA CALCULAR EL TOTAL DE TU ENVÍO.
                  </label>
                  <select
                    id="cart-shipping-city"
                    value={shippingCity}
                    onChange={(event) => setShippingCity(event.target.value)}
                    className="mt-3 w-full rounded-xl border border-card-border bg-white px-3 py-3 text-[14px] font-semibold text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15"
                  >
                    <option value="">Selecciona tu ciudad</option>
                    {SHIPPING_DESTINATION_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.destinations.map((destination) => (
                          <option key={destination.value} value={destination.value}>
                            {destination.label} - {formatCOP(destination.cost)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                    El domicilio se suma automáticamente según los costos de
                    envío vigentes.
                  </p>
                </div>

                <h2 className="mt-5 text-[18px] font-extrabold text-brand">
                  Resumen
                </h2>

                <div className="mt-4 rounded-lg bg-white px-3 py-2 text-center text-[12px] font-bold uppercase tracking-wide text-brand shadow-sm">
                  Pedido mínimo {formatCOP(MIN_ORDER_VALUE)}
                </div>

                <dl className="mt-4 space-y-2 text-[14px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Subtotal</dt>
                    <dd className="font-semibold text-ink">
                      {formatCOP(summary.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Envío</dt>
                    <dd className="font-semibold text-ink">
                      {selectedShippingDestination ? (
                        formatCOP(summary.shipping)
                      ) : (
                        <span className="text-brand">Por calcular</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-baseline justify-between border-t border-card-border pt-4">
                  <span className="text-[14px] font-semibold text-ink">
                    Total
                  </span>
                  <span className="text-[22px] font-extrabold text-brand">
                    {selectedShippingDestination
                      ? formatCOP(summary.total)
                      : "Por calcular"}
                  </span>
                </div>

                <Link
                  href={checkoutHref}
                  aria-disabled={!selectedShippingDestination}
                  className={
                    "mt-5 flex w-full items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-all " +
                    (selectedShippingDestination
                      ? "bg-brand hover:scale-[1.02] hover:bg-brand-dark"
                      : "cursor-not-allowed bg-brand/45")
                  }
                >
                  {selectedShippingDestination
                    ? "Proceder al pago"
                    : "Selecciona ciudad para continuar"}
                </Link>

                <a
                  href="https://wa.me/573234392470"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-whatsapp px-6 py-3 text-[14px] font-semibold text-whatsapp-dark transition-colors hover:bg-whatsapp hover:text-white"
                >
                  <Image
                    src="/icons/whatsapp.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  Comprar por WhatsApp
                </a>

                <p className="mt-4 text-center text-[11px] leading-[1.5] text-ink-muted">
                  Pagos seguros • Entrega a domicilio según cobertura.
                </p>
                <p className="mt-2 text-center text-[11px] font-semibold leading-[1.5] text-brand">
                  El costo depende de la ciudad seleccionada.
                </p>
                <Link
                  href="/envios"
                  className="mt-3 block text-center text-[12px] font-semibold text-brand underline-offset-2 hover:underline"
                >
                  Ver costos por zona y tiempos de entrega →
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
