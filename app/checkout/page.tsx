"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductVisual from "../components/ProductVisual";
import { useCart } from "../components/CartProvider";
import { useMockLoading } from "../components/useMockLoading";
import { buildCartSummary } from "../lib/cart-summary";
import { formatCOP } from "../lib/products";
import {
  getShippingDestination,
  SHIPPING_DESTINATION_GROUPS,
} from "../lib/shipping-rates";
import { login, useSession } from "../../src/features/auth";

/** 0 = datos (acceder / invitado) · 1 = método de pago · 2 = revisar */
type Step = 0 | 1 | 2;

const STEPS = [
  { id: 0, label: "Datos" },
  { id: 1, label: "Pago" },
  { id: 2, label: "Revisar" },
] as const;

type Contact = { name: string; email: string; phone: string };
type Shipping = {
  address: string;
  city: string;
  department: string;
  notes: string;
};

/** Métodos habilitados dentro de PayU, para mostrarlos como sello de confianza. */
const PAYU_METHODS = ["Tarjetas", "PSE", "Nequi", "Otros"];

type PayuCheckoutResponse = {
  action: string;
  fields: Record<string, string>;
  orderId: string;
  referenceCode: string;
  persisted: boolean;
};

const GUEST_BULLETS = ["Sin crear cuentas", "Sin contraseña", "Compra en 2 mn"];

/** Ícono de "entrar" (flecha hacia un marco) usado en los títulos del paso 0. */
function EnterIcon({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 28" className={className} fill="none" aria-hidden>
      <path
        d="M18 3h7a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3h-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 14h16m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepDot({
  active,
  done,
  label,
  index,
}: {
  active: boolean;
  done: boolean;
  label: string;
  index: number;
}) {
  return (
    <li className="flex flex-1 items-center gap-2 sm:gap-3">
      <span
        className={
          "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors sm:h-8 sm:w-8 sm:text-[12px] " +
          (done || active ? "bg-brand text-white" : "bg-[#eef0ff] text-brand")
        }
      >
        {done ? "✓" : index + 1}
      </span>
      <span
        className={
          "hidden text-[12px] font-semibold transition-colors sm:inline sm:text-[13px] " +
          (active || done ? "text-brand" : "text-ink-muted")
        }
      >
        {label}
      </span>
    </li>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold uppercase tracking-wide text-brand">
        {label}
      </span>
      <span className="mt-1 block">{children}</span>
      {error && <span className="mt-1 block text-[12px] text-red-600">{error}</span>}
    </label>
  );
}

/** Campo del paso 0 con el estilo del diseño (label gris + input alto). */
function DesignField({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="ph-condensed block text-[17px] font-bold text-[#6b7280]"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

const baseInput =
  "w-full rounded-lg border border-card-border bg-white px-3 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15";

/** Input alto y redondeado del diseño del paso 0. */
const designInput =
  "w-full rounded-[10px] border border-[#e6e8f0] bg-white px-4 py-3.5 text-[15px] text-ink shadow-[0_2px_6px_rgba(16,24,40,0.06)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15";

/** Botón azul ancho del diseño. */
const designButton =
  "ph-display inline-flex w-full items-center justify-center gap-3 rounded-[8px] bg-brand px-6 py-4 text-[20px] uppercase leading-none text-white shadow-[0_4px_10px_rgba(27,34,166,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-brand-dark disabled:opacity-60";

function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

function LockShield({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 11.5V10a2.5 2.5 0 0 1 5 0v1.5M8.8 11.5h6.4v4H8.8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Overlay a pantalla completa mientras se prepara el pago con PayU. */
function PayuLoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-0 z-50 grid place-items-center bg-brand/70 px-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eef0ff] text-brand">
          <Spinner className="h-8 w-8" />
        </div>
        <p className="mt-5 text-[18px] font-extrabold text-brand">
          Conectando con PayU…
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          Te estamos redirigiendo a la pasarela de pago segura. No cierres ni
          actualices esta ventana.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const initialLoading = useMockLoading();
  const { items, hydrated, clear } = useCart();
  const isAuthenticated = useSession((state) => state.isAuthenticated());
  const ready = hydrated && !initialLoading;

  const [step, setStep] = useState<Step>(0);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState<Shipping>({
    address: "",
    city: "",
    department: "",
    notes: "",
  });
  const selectedShippingDestination = useMemo(
    () => getShippingDestination(shipping.city),
    [shipping.city],
  );
  const summary = useMemo(
    () =>
      buildCartSummary(items, {
        shippingCost: selectedShippingDestination?.cost ?? 0,
      }),
    [items, selectedShippingDestination?.cost],
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const city = new URLSearchParams(window.location.search).get("city");
    const destination = city ? getShippingDestination(city) : undefined;
    if (!destination) return;
    setShipping((current) =>
      current.city
        ? current
        : {
            ...current,
            city: destination.value,
            department: destination.department,
          },
    );
  }, []);

  async function handleInlineLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const user = await login({ email: authEmail, password: authPassword });
      setContact((current) => ({
        ...current,
        name: current.name || user.name,
        email: user.email,
      }));
      setAuthNotice(
        "Sesión iniciada. Completa tus datos de entrega para ir al pago.",
      );
      setErrors({});
    } catch {
      setAuthError("No pudimos iniciar sesión. Revisa tu email y contraseña.");
    } finally {
      setAuthLoading(false);
    }
  }

  /** El paso 0 pide contacto + envío juntos (como en el diseño). */
  function validateDatos(): boolean {
    const err: Record<string, string> = {};
    if (!contact.name.trim()) err.name = "Ingresa tu nombre completo";
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) err.email = "Email no válido";
    if (!/^[\d\s+()-]{7,}$/.test(contact.phone)) err.phone = "Teléfono no válido";
    if (!shipping.address.trim()) err.address = "Ingresa una dirección";
    if (!selectedShippingDestination) {
      err.city = "Selecciona una ciudad disponible";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function goToPayment() {
    if (!validateDatos()) return;
    setStep(1);
  }

  function goBack() {
    setStep((s) => (Math.max(0, s - 1) as Step));
  }

  function redirectToPayu({ action, fields }: PayuCheckoutResponse) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.style.display = "none";

    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  async function submitOrder() {
    if (!validateDatos()) {
      setStep(0);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const fallbackOrderId = `PH-${Math.floor(100000 + Math.random() * 900000)}`;
    const normalizedShipping = {
      ...shipping,
      city: selectedShippingDestination?.label ?? shipping.city,
      department: selectedShippingDestination?.department ?? shipping.department,
    };
    const payload = {
      orderId: fallbackOrderId,
      contact,
      shipping: normalizedShipping,
      payment: "payu",
      customerType: isAuthenticated ? "authenticated" : "guest",
      lines: summary.lines.map((l) => ({
        slug: l.product.slug,
        title: l.product.title,
        quantity: l.item.quantity,
        unit: l.product.priceValue,
        total: l.lineTotal,
      })),
      totals: {
        subtotal: summary.subtotal,
        shipping: summary.shipping,
        total: summary.total,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/payments/payu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          contact,
          shipping: normalizedShipping,
          customerType: isAuthenticated ? "authenticated" : "guest",
        }),
      });
      const data = (await response.json()) as
        | PayuCheckoutResponse
        | { error?: string };

      if (!response.ok || !("action" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "No pudimos preparar el pago con PayU.",
        );
      }

      try {
        sessionStorage.setItem(
          "phplus.lastOrder",
          JSON.stringify({
            ...payload,
            orderId: data.orderId,
            payuReferenceCode: data.referenceCode,
            persisted: data.persisted,
          }),
        );
      } catch {
        // ignore
      }

      clear();
      // El overlay sigue visible hasta que el navegador salta a PayU: por eso
      // NO hacemos setSubmitting(false) en el camino feliz.
      redirectToPayu(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos conectar con PayU. Intenta nuevamente.",
      );
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-page flex-1 px-5 py-12 sm:px-8 lg:px-12">
          <div className="skeleton h-8 w-56 rounded" />
          <div className="mt-8 grid grid-cols-1 gap-8">
            <div className="space-y-4 rounded-2xl border border-card-border bg-white p-5 sm:p-6">
              <div className="skeleton h-5 w-44 rounded" />
              <div className="skeleton h-11 w-full rounded-lg" />
              <div className="skeleton h-11 w-full rounded-lg" />
              <div className="skeleton h-12 w-full rounded-lg" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (summary.lines.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-white">
          <section className="mx-auto max-w-page px-5 py-12 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-card-border bg-[#fafbfd] px-6 py-14 text-center">
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
              <h1 className="mt-5 text-[22px] font-extrabold text-brand">
                Aún no tienes productos para pagar
              </h1>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-muted">
                Para continuar al checkout, primero agrega una presentación de
                PH PLUS a tu carrito.
              </p>
              <Link
                href="/productos"
                className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
              >
                Ver productos
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  /* ─────────────────── Paso 0: Acceder / Invitado (diseño) ─────────────── */
  if (step === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-white">
          <section className="w-full bg-brand py-10 text-center text-white sm:py-12">
            <h1 className="ph-display text-[30px] uppercase leading-none sm:text-[42px]">
              Completa tu compra
            </h1>
            <p className="ph-condensed mt-4 text-[16px] font-bold sm:text-[22px]">
              Elige cómo quieres continuar
            </p>
          </section>

          <section className="mx-auto max-w-[820px] px-5 py-10 sm:px-8 sm:py-14">
            {/* ── Acceder ── */}
            <div className="rounded-2xl border border-card-border bg-white p-6 shadow-[0_10px_28px_rgba(27,34,166,0.08)] sm:p-8">
              <div className="flex items-center gap-4">
                <EnterIcon className="h-11 w-11 shrink-0 text-ink" />
                <h2 className="ph-display text-[20px] uppercase leading-none text-brand sm:text-[24px]">
                  Acceder
                </h2>
              </div>
              <p className="ph-condensed mt-2 text-[15px] leading-snug text-ink sm:text-[17px]">
                Si ya tienes cuenta, inicia sesión para continuar con tu
                información guardada.
              </p>

              <form onSubmit={handleInlineLogin} className="mt-6 space-y-5">
                <DesignField label="Email" htmlFor="login-email">
                  <input
                    id="login-email"
                    type="email"
                    className={designInput}
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    autoComplete="email"
                  />
                </DesignField>
                <DesignField label="Contraseña" htmlFor="login-password">
                  <input
                    id="login-password"
                    type="password"
                    className={designInput}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </DesignField>

                <a
                  href="mailto:info@aguaphplus.com?subject=Recuperar%20contrase%C3%B1a"
                  className="ph-condensed block text-[15px] text-ink hover:underline"
                >
                  Olvidaste tu contraseña
                </a>

                {authError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">
                    {authError}
                  </p>
                )}
                {authNotice && (
                  <p className="rounded-lg bg-[#eef0ff] px-3 py-2 text-[13px] font-semibold text-brand">
                    {authNotice}
                  </p>
                )}

                <button type="submit" disabled={authLoading} className={designButton}>
                  {authLoading ? "Accediendo..." : "Acceder"}
                  <EnterIcon className="h-6 w-6" />
                </button>
              </form>

              <p className="ph-condensed mt-3 text-center text-[15px] text-ink">
                ¿No tienes cuenta?{" "}
                <Link href="/cuenta" className="font-bold text-[#6b7280] hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>

            {/* ── Acceder como invitado ── */}
            <div className="mt-10 rounded-2xl border border-card-border bg-white p-6 shadow-[0_10px_28px_rgba(27,34,166,0.08)] sm:p-8">
              <div className="flex items-center gap-4">
                <EnterIcon className="h-11 w-11 shrink-0 text-ink" />
                <h2 className="ph-display text-[20px] uppercase leading-none text-brand sm:text-[24px]">
                  Acceder como invitado
                </h2>
              </div>

              <ul className="ph-condensed mt-4 space-y-1 pl-5 text-[16px] font-bold text-[#6b7280] sm:text-[18px]">
                {GUEST_BULLETS.map((b) => (
                  <li key={b} className="list-disc">
                    {b}
                  </li>
                ))}
              </ul>
              <p className="ph-condensed mt-3 text-[15px] text-ink sm:text-[17px]">
                Solo necesitamos para la factura electrónica
              </p>

              <div className="mt-6 space-y-5">
                <DesignField label="Nombre*" htmlFor="guest-name" error={errors.name}>
                  <input
                    id="guest-name"
                    className={designInput}
                    value={contact.name}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, name: e.target.value }))
                    }
                    autoComplete="name"
                  />
                </DesignField>

                <DesignField label="Email*" htmlFor="guest-email" error={errors.email}>
                  <input
                    id="guest-email"
                    type="email"
                    className={designInput}
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                    autoComplete="email"
                  />
                </DesignField>

                <DesignField label="Teléfono*" htmlFor="guest-phone" error={errors.phone}>
                  <input
                    id="guest-phone"
                    type="tel"
                    className={designInput}
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                    autoComplete="tel"
                  />
                </DesignField>

                <DesignField
                  label="Dirección*"
                  htmlFor="guest-address"
                  error={errors.address}
                >
                  <input
                    id="guest-address"
                    className={designInput}
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address: e.target.value }))
                    }
                    autoComplete="street-address"
                  />
                </DesignField>

                <DesignField label="Ciudad*" htmlFor="guest-city" error={errors.city}>
                  <select
                    id="guest-city"
                    className={designInput}
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping((s) => {
                        const destination = getShippingDestination(e.target.value);
                        return {
                          ...s,
                          city: e.target.value,
                          department: destination?.department ?? "",
                        };
                      })
                    }
                    autoComplete="address-level2"
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
                </DesignField>
              </div>

              <button type="button" onClick={goToPayment} className={`${designButton} mt-8`}>
                Ir al pago
              </button>
              <p className="ph-condensed mt-3 text-center text-[15px] text-ink">
                Después podrás crear cuenta si lo deseas
              </p>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/carrito"
                className="text-[13px] font-semibold text-ink-muted hover:text-brand"
              >
                ← Volver al carrito
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  /* ─────────────────── Pasos 1 y 2: Pago y Revisar ─────────────────────── */
  return (
    <>
      {submitting && <PayuLoadingOverlay />}
      <Header />

      <main className="flex-1 bg-white">
        <nav className="mx-auto max-w-page px-5 pt-6 text-[12px] text-ink-muted sm:px-8 sm:text-[13px] lg:px-12">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/carrito" className="hover:underline">
            Carrito
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Checkout</span>
        </nav>

        <section className="mx-auto max-w-page px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <h1 className="text-[24px] font-extrabold text-brand sm:text-[30px]">
            Finalizar compra
          </h1>

          <ol className="mt-6 flex items-center gap-2 overflow-x-auto sm:gap-3">
            {STEPS.map((s) => (
              <StepDot
                key={s.id}
                active={step === s.id}
                done={step > s.id}
                label={s.label}
                index={s.id}
              />
            ))}
          </ol>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="rounded-2xl border border-card-border bg-white p-5 sm:p-6">
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-[16px] font-extrabold text-brand">
                    Método de pago
                  </h2>

                  <div className="rounded-2xl border-2 border-brand bg-[#eef0ff] p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-white">
                        <LockShield className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-[15px] font-bold text-ink">
                          Pago en línea con PayU
                        </p>
                        <p className="text-[12px] text-ink-muted">
                          Te llevamos a la pasarela segura de PayU para
                          finalizar el pago.
                        </p>
                      </div>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {PAYU_METHODS.map((m) => (
                        <li
                          key={m}
                          className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-brand shadow-[0_1px_3px_rgba(27,34,166,0.12)]"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Field label="Notas para la entrega (opcional)">
                    <textarea
                      className={baseInput + " min-h-[88px] resize-y"}
                      value={shipping.notes}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, notes: e.target.value }))
                      }
                      placeholder="Ej.: Llamar al portero, segundo piso..."
                    />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-[16px] font-extrabold text-brand">
                    Confirma tu pedido
                  </h2>

                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                      Contacto
                    </p>
                    <p className="mt-1 text-[14px] text-ink">
                      {contact.name} · {contact.email} · {contact.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                      Dirección
                    </p>
                    <p className="mt-1 text-[14px] text-ink">
                      {shipping.address},{" "}
                      {selectedShippingDestination?.label ?? shipping.city}
                    </p>
                    {shipping.notes && (
                      <p className="mt-1 text-[13px] text-ink-muted">
                        Notas: {shipping.notes}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                      Método de pago
                    </p>
                    <p className="mt-1 text-[14px] text-ink">
                      Pago en línea con PayU
                    </p>
                  </div>

                  <div className="rounded-xl border border-card-border p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                      Productos
                    </p>
                    <ul className="mt-2 space-y-2 text-[13px] text-ink">
                      {summary.lines.map((l) => (
                        <li key={l.product.slug} className="flex justify-between">
                          <span>
                            {l.product.title} × {l.item.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatCOP(l.lineTotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {submitError && (
                <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
                  {submitError}
                </p>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-full border border-card-border px-5 py-2.5 text-[13px] font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand"
                >
                  ← Atrás
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {submitting && <Spinner className="h-4 w-4" />}
                    {submitting ? "Conectando con PayU..." : "Pagar con PayU"}
                  </button>
                )}
              </div>
            </div>

            <aside className="rounded-2xl border border-card-border bg-[#fafbfd] p-5 lg:sticky lg:top-24">
              <h2 className="text-[16px] font-extrabold text-brand">
                Resumen del pedido
              </h2>
              <ul className="mt-4 space-y-3">
                {summary.lines.map((l) => (
                  <li key={l.product.slug} className="flex items-center gap-3">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white">
                      <ProductVisual
                        visualKey={l.product.visualKey}
                        className="h-12 w-auto"
                      />
                    </div>
                    <div className="flex-1 text-[12px]">
                      <p className="font-semibold text-ink">{l.product.title}</p>
                      <p className="text-ink-muted">× {l.item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-bold text-brand">
                      {formatCOP(l.lineTotal)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-card-border pt-4 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="text-ink">{formatCOP(summary.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Envío</dt>
                  <dd className="text-ink">
                    {formatCOP(summary.shipping)}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex items-baseline justify-between border-t border-card-border pt-3">
                <span className="text-[14px] font-semibold">Total</span>
                <span className="text-[20px] font-extrabold text-brand">
                  {formatCOP(summary.total)}
                </span>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
