"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductVisual from "../components/ProductVisual";
import { useCart } from "../components/CartProvider";
import { useMockLoading } from "../components/useMockLoading";
import { buildCartSummary } from "../lib/cart-summary";
import { formatCOP } from "../lib/products";
import { login, useSession } from "../../src/features/auth";

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { id: 0, label: "Acceder" },
  { id: 1, label: "Envío" },
  { id: 2, label: "Pago" },
  { id: 3, label: "Revisar" },
] as const;

type Contact = { name: string; email: string; phone: string };
type Shipping = {
  address: string;
  city: string;
  department: string;
  notes: string;
};
type PaymentMethod = "tarjeta" | "pse" | "nequi" | "contra-entrega";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "tarjeta", label: "Tarjeta de crédito/débito", hint: "Visa, Mastercard" },
  { value: "pse", label: "PSE", hint: "Débito desde tu banco" },
  { value: "nequi", label: "Nequi", hint: "Pago desde la app" },
  { value: "contra-entrega", label: "Pago contra entrega", hint: "Efectivo al recibir" },
];

const DEPARTMENTS = [
  "Cundinamarca",
  "Antioquia",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Risaralda",
  "Santander",
  "Tolima",
  "Valle del Cauca",
];

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
          (done
            ? "bg-brand text-white"
            : active
              ? "bg-brand text-white"
              : "bg-[#eef0ff] text-brand")
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

const baseInput =
  "w-full rounded-lg border border-card-border bg-white px-3 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function CheckoutPage() {
  const router = useRouter();
  const initialLoading = useMockLoading();
  const { items, hydrated, clear } = useCart();
  const isAuthenticated = useSession((state) => state.isAuthenticated());
  const summary = useMemo(() => buildCartSummary(items), [items]);
  const ready = hydrated && !initialLoading;

  const [step, setStep] = useState<Step>(0);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState<Shipping>({
    address: "",
    city: "",
    department: "Cundinamarca",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("tarjeta");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const canEnterContact = isAuthenticated || guestCheckout;

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
      setGuestCheckout(false);
      setErrors({});
      setStep(1);
    } catch {
      setAuthError("No pudimos iniciar sesión. Revisa tu email y contraseña.");
    } finally {
      setAuthLoading(false);
    }
  }

  function validateStep(target: Step): boolean {
    const err: Record<string, string> = {};
    if (target >= 1) {
      if (!contact.name.trim()) err.name = "Ingresa tu nombre completo";
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) err.email = "Email no válido";
      if (!/^[\d\s+()-]{7,}$/.test(contact.phone)) err.phone = "Teléfono no válido";
    }
    if (target >= 2) {
      if (!shipping.address.trim()) err.address = "Ingresa una dirección";
      if (!shipping.city.trim()) err.city = "Ingresa tu ciudad";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function goNext() {
    if (step === 0 && !canEnterContact) {
      setAuthError("Inicia sesión o continúa como invitado para avanzar.");
      return;
    }
    const target = (step + 1) as Step;
    if (!validateStep(target)) return;
    setStep(target);
  }

  function goBack() {
    setStep((s) => (Math.max(0, s - 1) as Step));
  }

  function submitOrder() {
    setSubmitting(true);
    const orderId = `PH-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      orderId,
      contact,
      shipping,
      payment,
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
      sessionStorage.setItem("phplus.lastOrder", JSON.stringify(payload));
    } catch {
      // ignore
    }
    clear();
    router.push(`/checkout/exito?order=${orderId}`);
  }

  if (!ready) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-page flex-1 px-5 py-12 sm:px-8 lg:px-12">
          <div className="skeleton h-8 w-56 rounded" />
          <div className="mt-6 flex items-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-1 items-center gap-2">
                <div className="skeleton h-7 w-7 rounded-full sm:h-8 sm:w-8" />
                <div className="skeleton hidden h-3 w-16 rounded sm:block" />
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4 rounded-2xl border border-card-border bg-white p-5 sm:p-6">
              <div className="skeleton h-5 w-44 rounded" />
              <div className="skeleton h-11 w-full rounded-lg" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="skeleton h-11 w-full rounded-lg" />
                <div className="skeleton h-11 w-full rounded-lg" />
              </div>
              <div className="mt-6 flex justify-between">
                <div className="skeleton h-9 w-24 rounded-full" />
                <div className="skeleton h-9 w-32 rounded-full" />
              </div>
            </div>
            <div className="skeleton h-72 rounded-2xl" />
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

  return (
    <>
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
              {step === 0 && (
                <div className="space-y-4">
                  {!canEnterContact ? (
                    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                      <form
                        onSubmit={handleInlineLogin}
                        className="rounded-2xl border border-card-border bg-[#fafbfd] p-5"
                      >
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                          Acceder
                        </p>
                        <h2 className="mt-1 text-[19px] font-extrabold text-brand">
                          Inicia sesión para continuar
                        </h2>
                        <p className="mt-2 text-[13px] leading-[1.5] text-ink-muted">
                          Si ya tienes cuenta, entra con tu email y contraseña.
                          Seguimos con el pago sin sacar tu carrito del checkout.
                        </p>
                        <div className="mt-5 space-y-4">
                          <Field label="Email">
                            <input
                              type="email"
                              className={baseInput}
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              placeholder="tu@correo.com"
                              autoComplete="email"
                              required
                            />
                          </Field>
                          <Field label="Contraseña">
                            <input
                              type="password"
                              className={baseInput}
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="Tu contraseña"
                              autoComplete="current-password"
                              required
                            />
                          </Field>
                        </div>
                        {authError && (
                          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700">
                            {authError}
                          </p>
                        )}
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="submit"
                            disabled={authLoading}
                            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-60"
                          >
                            {authLoading ? "Accediendo..." : "Acceder y continuar"}
                          </button>
                          <a
                            href="mailto:info@aguaphplus.com?subject=Recuperar%20contrase%C3%B1a"
                            className="text-[12px] font-semibold text-brand hover:underline"
                          >
                            ¿Olvidaste tu contraseña?
                          </a>
                        </div>
                      </form>

                      <div className="rounded-2xl border border-card-border bg-white p-5 shadow-[0_10px_28px_rgba(27,34,166,0.08)]">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
                          Compra rápida
                        </p>
                        <h2 className="mt-1 text-[19px] font-extrabold text-brand">
                          Acceder como invitado
                        </h2>
                        <p className="mt-2 text-[13px] leading-[1.55] text-ink-muted">
                          Sin crear cuenta y sin contraseña. Solo necesitamos
                          tus datos para la entrega y la factura electrónica.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setGuestCheckout(true);
                            setAuthError(null);
                          }}
                          className="mt-5 inline-flex items-center justify-center rounded-full border-2 border-brand bg-white px-5 py-2.5 text-[13px] font-extrabold text-brand shadow-[2px_3px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
                        >
                          Continuar como invitado
                        </button>
                        <p className="mt-4 text-[12px] font-semibold text-ink-muted">
                          Después podrás crear cuenta si lo deseas.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-xl bg-[#eef0ff] px-4 py-3 text-[13px] text-brand">
                        {isAuthenticated
                          ? "Sesión activa. Confirma tus datos para continuar al envío."
                          : "Compra como invitado. Completa tus datos para continuar."}
                      </div>
                      <h2 className="text-[16px] font-extrabold text-brand">
                        Datos de contacto
                      </h2>
                      <Field label="Nombre completo" error={errors.name}>
                        <input
                          className={baseInput}
                          value={contact.name}
                          onChange={(e) =>
                            setContact((c) => ({ ...c, name: e.target.value }))
                          }
                          placeholder="Sirley Montoya"
                          autoComplete="name"
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Email" error={errors.email}>
                          <input
                            type="email"
                            className={baseInput}
                            value={contact.email}
                            onChange={(e) =>
                              setContact((c) => ({ ...c, email: e.target.value }))
                            }
                            placeholder="tu@correo.com"
                            autoComplete="email"
                          />
                        </Field>
                        <Field label="Teléfono / WhatsApp" error={errors.phone}>
                          <input
                            type="tel"
                            className={baseInput}
                            value={contact.phone}
                            onChange={(e) =>
                              setContact((c) => ({ ...c, phone: e.target.value }))
                            }
                            placeholder="+57 300 000 0000"
                            autoComplete="tel"
                          />
                        </Field>
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-[16px] font-extrabold text-brand">
                    Dirección de envío
                  </h2>
                  <Field label="Dirección" error={errors.address}>
                    <input
                      className={baseInput}
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, address: e.target.value }))
                      }
                      placeholder="Calle 123 # 45-67, Apto 101"
                      autoComplete="street-address"
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Ciudad" error={errors.city}>
                      <input
                        className={baseInput}
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, city: e.target.value }))
                        }
                        placeholder="Bogotá"
                        autoComplete="address-level2"
                      />
                    </Field>
                    <Field label="Departamento">
                      <select
                        className={baseInput}
                        value={shipping.department}
                        onChange={(e) =>
                          setShipping((s) => ({
                            ...s,
                            department: e.target.value,
                          }))
                        }
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
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
                <div className="space-y-4">
                  <h2 className="text-[16px] font-extrabold text-brand">
                    Método de pago
                  </h2>
                  <p className="text-[13px] text-ink-muted">
                    Selecciona tu método preferido. Este es un mockup —
                    cuando conectemos el backend se integrará la pasarela
                    real.
                  </p>
                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={
                          "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors " +
                          (payment === opt.value
                            ? "border-brand bg-[#eef0ff]"
                            : "border-card-border hover:border-brand")
                        }
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.value}
                          checked={payment === opt.value}
                          onChange={() => setPayment(opt.value)}
                          className="mt-1 h-4 w-4 accent-[#1b22a6]"
                        />
                        <span>
                          <span className="block text-[14px] font-semibold text-ink">
                            {opt.label}
                          </span>
                          <span className="block text-[12px] text-ink-muted">
                            {opt.hint}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
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
                      {shipping.address}, {shipping.city}, {shipping.department}
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
                      {PAYMENT_OPTIONS.find((p) => p.value === payment)?.label}
                    </p>
                  </div>

                  <div className="rounded-xl border border-card-border p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
                      Productos
                    </p>
                    <ul className="mt-2 space-y-2 text-[13px] text-ink">
                      {summary.lines.map((l) => (
                        <li
                          key={l.product.slug}
                          className="flex justify-between"
                        >
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

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center justify-center rounded-full border border-card-border px-5 py-2.5 text-[13px] font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    ← Atrás
                  </button>
                ) : (
                  <Link
                    href="/carrito"
                    className="inline-flex items-center justify-center text-[13px] font-semibold text-ink-muted hover:text-brand"
                  >
                    ← Volver al carrito
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={step === 0 && !canEnterContact}
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {step === 1 ? "Ir al pago" : "Continuar"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-60"
                  >
                    {submitting ? "Procesando..." : "Confirmar pedido"}
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
                    {summary.shipping === 0 ? (
                      <span className="text-whatsapp-dark">Gratis</span>
                    ) : (
                      formatCOP(summary.shipping)
                    )}
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
