"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Button, Input, Select } from "@/src/shared/ui";
import type {
  CartItemInput,
  ProductLike,
  ProductLookup,
} from "@/src/features/cart";
import type {
  Coupon,
  CouponRepository,
} from "@/src/features/coupons";
import { couponRepo as defaultCouponRepo } from "@/src/features/coupons";
import type { ShippingZone } from "@/src/features/shipping";
import type { Order, OrderRepository } from "@/src/features/orders";
import { orderRepo as defaultOrderRepo } from "@/src/features/orders";
import {
  CheckoutFormSchema,
  COLOMBIAN_DEPARTMENTS,
  ContactSchema,
  PAYMENT_METHODS,
  PaymentSchema,
  ShippingAddressSchema,
  type CheckoutPaymentMethod,
} from "../domain/schema";
import { combineTotals, submitOrder } from "../domain/totals";
import { useCheckout } from "../store/useCheckout";
import { CheckoutSummary } from "./CheckoutSummary";

export interface CheckoutFormProps<P extends ProductLike = ProductLike> {
  items: CartItemInput[];
  lookup: ProductLookup<P>;
  shippingZones?: ShippingZone[];
  /** Cupón resuelto (caller lo resuelve para pre-cargar; el form sólo necesita el objeto). */
  resolvedCoupon?: Coupon | null;
  userId?: string;
  /** Llamado cuando el pedido fue creado con éxito. El caller puede navegar / limpiar carrito. */
  onSubmitted?: (order: Order) => void;
  /** Inyectables para tests. */
  orderRepo?: OrderRepository;
  couponRepo?: CouponRepository;
  now?: Date;
}

const PAYMENT_LABELS: Record<CheckoutPaymentMethod, string> = {
  credit_card: "Tarjeta de crédito / débito",
  pse: "PSE",
  nequi: "Nequi",
  cash_on_delivery: "Pago contra entrega",
};

const EXPRESS_BUTTONS = [
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "mercado-pago", label: "Mercado Pago" },
  { id: "pse", label: "PSE rápido" },
];

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  postalCode?: string;
  notes?: string;
  method?: string;
  card4Last?: string;
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

type ZodSafeResult = {
  success: boolean;
  error?: { issues: Array<{ path: PropertyKey[]; message: string }> };
};

function pickError(result: ZodSafeResult, field: string): string | undefined {
  if (result.success || !result.error) return undefined;
  const issue = result.error.issues.find((i) => i.path[0] === field);
  return issue?.message;
}

export function CheckoutForm<P extends ProductLike = ProductLike>({
  items,
  lookup,
  shippingZones,
  resolvedCoupon = null,
  userId,
  onSubmitted,
  orderRepo = defaultOrderRepo,
  couponRepo = defaultCouponRepo,
  now,
}: CheckoutFormProps<P>) {
  const draftContact = useCheckout((s) => s.contact);
  const draftShipping = useCheckout((s) => s.shipping);
  const draftPayment = useCheckout((s) => s.payment);
  const setContact = useCheckout((s) => s.setContact);
  const setShipping = useCheckout((s) => s.setShipping);
  const setPayment = useCheckout((s) => s.setPayment);
  const clearDraft = useCheckout((s) => s.clear);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contact = {
    name: draftContact.name ?? "",
    email: draftContact.email ?? "",
    phone: draftContact.phone ?? "",
  };
  const shipping = {
    address: draftShipping.address ?? "",
    city: draftShipping.city ?? "",
    department: draftShipping.department,
    postalCode: draftShipping.postalCode ?? "",
    notes: draftShipping.notes ?? "",
  };
  const payment = {
    method: draftPayment.method,
    card4Last: draftPayment.card4Last ?? "",
  };

  // Snapshot vivo para mostrar resumen y total en el CTA.
  const snapshot = useMemo(
    () =>
      combineTotals({
        items,
        lookup,
        coupon: resolvedCoupon,
        shippingZones,
        city: shipping.city || undefined,
        now,
      }),
    [items, lookup, resolvedCoupon, shippingZones, shipping.city, now],
  );

  const isValid = useMemo(() => {
    return CheckoutFormSchema.safeParse({ contact, shipping, payment }).success;
  }, [contact, shipping, payment]);

  // Limpiar errores cuando ya son válidos.
  useEffect(() => {
    if (isValid && Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [isValid, errors]);

  function validateContactField(field: "name" | "email" | "phone") {
    const r = ContactSchema.safeParse(contact);
    setErrors((prev) => ({ ...prev, [field]: pickError(r, field) }));
  }

  function validateShippingField(
    field: "address" | "city" | "department" | "postalCode" | "notes",
  ) {
    const r = ShippingAddressSchema.safeParse(shipping);
    setErrors((prev) => ({ ...prev, [field]: pickError(r, field) }));
  }

  function validatePaymentField(field: "method" | "card4Last") {
    const r = PaymentSchema.safeParse(payment);
    setErrors((prev) => ({ ...prev, [field]: pickError(r, field) }));
  }

  async function handleSubmit() {
    setSubmitError(null);
    // Validación final.
    const result = CheckoutFormSchema.safeParse({
      contact,
      shipping,
      payment,
    });
    if (!result.success) {
      const newErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const f = issue.path[issue.path.length - 1] as keyof FieldErrors;
        if (!newErrors[f]) newErrors[f] = issue.message;
      }
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      const order = await submitOrder(
        {
          items,
          contact: result.data.contact,
          shipping: result.data.shipping,
          payment: result.data.payment,
          coupon: resolvedCoupon,
          shippingZones,
          userId,
          now,
        },
        { orderRepo, lookup },
      );
      clearDraft();
      onSubmitted?.(order);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setSubmitError(
        msg === "EMPTY_CART"
          ? "Tu carrito está vacío."
          : "No pudimos crear el pedido. Intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const departmentOptions = COLOMBIAN_DEPARTMENTS.map((d) => ({
    value: d,
    label: d,
  }));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="space-y-6"
        aria-label="Formulario de checkout"
      >
        {/* Express checkout placeholders */}
        <section
          aria-label="Pago express"
          className="rounded-2xl border border-card-border bg-white p-5"
        >
          <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-brand">
            Pago express
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EXPRESS_BUTTONS.map((b) => (
              <Button
                key={b.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => alert("Próximamente")}
              >
                {b.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          aria-label="Datos de contacto"
          className="space-y-4 rounded-2xl border border-card-border bg-white p-5"
        >
          <h2 className="text-[16px] font-extrabold text-brand">
            Datos de contacto
          </h2>
          <Input
            label="Nombre completo"
            required
            autoComplete="name"
            value={contact.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setContact({ name: e.target.value })
            }
            onBlur={() => validateContactField("name")}
            error={errors.name}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              value={contact.email}
              onChange={(e) => setContact({ email: e.target.value })}
              onBlur={() => validateContactField("email")}
              error={errors.email}
            />
            <Input
              label="Teléfono / WhatsApp"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              value={contact.phone}
              onChange={(e) => setContact({ phone: e.target.value })}
              onBlur={() => validateContactField("phone")}
              error={errors.phone}
            />
          </div>
        </section>

        {/* Shipping */}
        <section
          aria-label="Dirección de envío"
          className="space-y-4 rounded-2xl border border-card-border bg-white p-5"
        >
          <h2 className="text-[16px] font-extrabold text-brand">
            Dirección de envío
          </h2>
          <Input
            label="Dirección"
            required
            autoComplete="street-address"
            value={shipping.address}
            onChange={(e) => setShipping({ address: e.target.value })}
            onBlur={() => validateShippingField("address")}
            error={errors.address}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Ciudad"
              required
              autoComplete="address-level2"
              value={shipping.city}
              onChange={(e) => setShipping({ city: e.target.value })}
              onBlur={() => validateShippingField("city")}
              error={errors.city}
            />
            <Select
              label="Departamento"
              placeholder="Selecciona"
              options={departmentOptions}
              value={shipping.department ?? ""}
              onChange={(e) =>
                setShipping({
                  department: (e.target.value ||
                    undefined) as typeof shipping.department,
                })
              }
              onBlur={() => validateShippingField("department")}
              error={errors.department}
            />
          </div>
          <Input
            label="Código postal (opcional)"
            inputMode="numeric"
            autoComplete="postal-code"
            value={shipping.postalCode}
            onChange={(e) => setShipping({ postalCode: e.target.value })}
            onBlur={() => validateShippingField("postalCode")}
            error={errors.postalCode}
          />
          <Input
            label="Notas para la entrega (opcional)"
            value={shipping.notes}
            onChange={(e) => setShipping({ notes: e.target.value })}
            onBlur={() => validateShippingField("notes")}
            error={errors.notes}
          />
        </section>

        {/* Payment */}
        <section
          aria-label="Método de pago"
          className="space-y-4 rounded-2xl border border-card-border bg-white p-5"
        >
          <h2 className="text-[16px] font-extrabold text-brand">
            Método de pago
          </h2>
          <div className="space-y-2" role="radiogroup" aria-label="Método de pago">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m}
                className={
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors " +
                  (payment.method === m
                    ? "border-brand bg-[#eef0ff]"
                    : "border-card-border hover:border-brand")
                }
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={m}
                  checked={payment.method === m}
                  onChange={() => {
                    setPayment({ method: m });
                    validatePaymentField("method");
                  }}
                  className="h-4 w-4 accent-[#1b22a6]"
                />
                <span className="text-[14px] font-semibold text-ink">
                  {PAYMENT_LABELS[m]}
                </span>
              </label>
            ))}
          </div>
          {errors.method && (
            <p className="text-[12px] text-red-600">{errors.method}</p>
          )}
          {payment.method === "credit_card" && (
            <Input
              label="Últimos 4 dígitos (opcional)"
              inputMode="numeric"
              maxLength={4}
              value={payment.card4Last}
              onChange={(e) => setPayment({ card4Last: e.target.value })}
              onBlur={() => validatePaymentField("card4Last")}
              error={errors.card4Last}
            />
          )}
        </section>

        {submitError && (
          <p role="alert" className="text-[13px] text-red-600">
            {submitError}
          </p>
        )}

        <div className="hidden lg:block">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid || submitting}
            isLoading={submitting}
          >
            Pagar {formatMoney(snapshot.totals.total)}
          </Button>
        </div>

        {/* CTA sticky mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-card-border bg-white p-3 lg:hidden">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid || submitting}
            isLoading={submitting}
          >
            Pagar {formatMoney(snapshot.totals.total)}
          </Button>
        </div>
      </form>

      <CheckoutSummary snapshot={snapshot} couponRepo={couponRepo} />
    </div>
  );
}
