"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductThumb from "../components/ProductThumb";
import { useCart } from "../components/CartProvider";
import { useMockLoading } from "../components/useMockLoading";
import { buildCartSummary } from "../lib/cart-summary";
import { isMinimumOrderSubtotal, MIN_ORDER_VALUE } from "../lib/order-rules";
import { formatCOP } from "../lib/products";
import {
  getShippingDestination,
  SHIPPING_DESTINATION_GROUPS,
} from "../lib/shipping-rates";
import { login, useSession } from "../../src/features/auth";

/** 0 = datos (acceder / invitado) · 1 = método de pago · 2 = revisar */
type Step = 0 | 1;

const STEPS = [
  { id: 0, label: "Datos" },
  { id: 1, label: "Revisar y pagar" },
] as const;

type Contact = { name: string; email: string; phone: string };
type Shipping = {
  address: string;
  city: string;
  department: string;
  notes: string;
};

type RapydCheckoutResponse = {
  redirectUrl: string;
  checkoutId: string;
  orderId: string;
  referenceId: string;
  persisted: boolean;
};

const GUEST_BULLETS = ["Sin crear cuentas", "Sin contraseña", "Compra en 2 minutos"];

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

/** Ícono de ojo (abierto/cerrado) para el toggle de mostrar/ocultar contraseña. */
function EyeIcon({ open, className = "h-5 w-5" }: { open: boolean; className?: string }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
        <path
          d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M6.6 6.7C4 8.4 2 12 2 12s4 7 10 7c1.7 0 3.2-.4 4.5-1.1M9.9 4.2C10.6 4.1 11.3 4 12 4c7 0 11 8 11 8a17.5 17.5 0 0 1-3.1 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
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

/** Overlay a pantalla completa mientras se prepara el pago en la pasarela. */
function PaymentLoadingOverlay() {
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
          Conectando con la pasarela de pago…
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
  const { items, hydrated } = useCart();
  const isAuthenticated = useSession((state) => state.isAuthenticated());
  const ready = hydrated && !initialLoading;

  const [step, setStep] = useState<Step>(0);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
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
  const meetsMinimumOrder = isMinimumOrderSubtotal(summary.subtotal);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // setState diferido (no sincrónico en el cuerpo del efecto) para no
    // disparar el lint de "set-state-in-effect" — mismo patrón usado en
    // app/pedido/[id]/page.tsx.
    const t = setTimeout(() => {
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
    }, 0);
    return () => clearTimeout(t);
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

  function redirectToRapyd({ redirectUrl }: RapydCheckoutResponse) {
    // Hosted Checkout Page: Rapyd ya nos da la URL de su página alojada, no
    // hace falta armar ni postear un formulario con datos sensibles.
    window.location.href = redirectUrl;
  }

  async function submitOrder() {
    if (!meetsMinimumOrder) {
      setSubmitError(
        `La compra mínima es ${formatCOP(MIN_ORDER_VALUE)} en productos, sin incluir domicilio.`,
      );
      return;
    }
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
      payment: "rapyd",
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
      const response = await fetch("/api/payments/rapyd", {
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
        | RapydCheckoutResponse
        | { error?: string };

      if (!response.ok || !("redirectUrl" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "No pudimos preparar el pago con la pasarela.",
        );
      }

      try {
        sessionStorage.setItem(
          "phplus.lastOrder",
          JSON.stringify({
            ...payload,
            orderId: data.orderId,
            rapydReferenceId: data.referenceId,
            persisted: data.persisted,
          }),
        );
      } catch {
        // ignore
      }

      // OJO: el carrito NO se vacía acá. Antes se vaciaba antes de saber si
      // el pago se completaba — si el comprador cancelaba o el pago fallaba
      // en Rapyd, volvía con el carrito vacío y tenía que rearmar todo de
      // cero. Ahora se vacía sólo cuando la página de retorno confirma
      // "paid" contra la orden real (ver ClearCartOnPaid en
      // checkout/rapyd/respuesta), así "volver a intentar" simplemente
      // reusa el mismo carrito.
      // El overlay sigue visible hasta que el navegador salta a Rapyd: por
      // eso NO hacemos setSubmitting(false) en el camino feliz.
      redirectToRapyd(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos conectar con la pasarela de pago. Intenta nuevamente.",
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

  if (!meetsMinimumOrder) {
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
                Compra mínima en productos
              </h1>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-muted">
                La compra mínima es {formatCOP(MIN_ORDER_VALUE)} en productos,
                sin incluir domicilio. Agrega más productos para continuar.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
                >
                  Ver productos
                </Link>
                <Link
                  href="/carrito"
                  className="inline-flex items-center justify-center rounded-full border border-brand px-6 py-3 text-[14px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                >
                  Volver al carrito
                </Link>
              </div>
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
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showAuthPassword ? "text" : "password"}
                      className={designInput + " pr-11"}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword((v) => !v)}
                      aria-label={
                        showAuthPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                      aria-pressed={showAuthPassword}
                      className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-ink-muted transition-colors hover:text-ink"
                    >
                      <EyeIcon open={showAuthPassword} />
                    </button>
                  </div>
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
                    // Sin autocomplete: con autoComplete="address-level2" el
                    // navegador puede autorellenar este select con una ciudad
                    // guardada en el perfil del usuario (distinta a la que ya
                    // eligió en el carrito), pisando el valor precargado por
                    // el parámetro ?city= de la URL.
                    autoComplete="off"
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
      {submitting && <PaymentLoadingOverlay />}
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

                  <div className="rounded-xl border border-card-border p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                      Productos
                    </p>
                    <ul className="mt-2 space-y-2 text-[13px] text-ink">
                      {summary.lines.map((l) => (
                        <li
                          key={l.product.slug}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#f4f5fa]">
                              <ProductThumb
                                product={l.product}
                                className="h-10 w-10"
                                sizes="44px"
                              />
                            </span>
                            <span className="min-w-0">
                              {l.product.title} × {l.item.quantity}
                            </span>
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

              <p className="mt-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-brand">
                <LockShield className="h-4 w-4" />
                Pago seguro en línea
              </p>

              <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-full border border-card-border px-5 py-2.5 text-[13px] font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand"
                >
                  ← Atrás
                </button>

                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
                >
                  {submitting && <Spinner className="h-4 w-4" />}
                  {submitting ? "Conectando con la pasarela..." : "Confirmar pedido y elegir método de pago"}
                </button>
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
                      <ProductThumb
                        product={l.product}
                        className="h-12 w-12"
                        sizes="56px"
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

              <dl className="mt-4 space-y-2 border-t border-card-border pt-4 text-center text-[13px]">
                <div className="flex items-center justify-center gap-2">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="text-ink">{formatCOP(summary.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <dt className="text-ink-muted">Envío</dt>
                  <dd className="text-ink">
                    {formatCOP(summary.shipping)}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-col items-center gap-1 border-t border-card-border pt-3 text-center">
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
