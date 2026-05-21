"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/src/shared/ui";
import { SettingsSchema, type Settings } from "../domain/settings";

export interface SettingsFormProps {
  initial: Settings;
  onSave: (next: Settings) => void;
  submitting?: boolean;
}

const PAYMENT_OPTIONS = [
  { id: "credit_card", label: "Tarjeta de crédito" },
  { id: "pse", label: "PSE" },
  { id: "nequi", label: "Nequi" },
  { id: "cash_on_delivery", label: "Pago contra entrega" },
];

type FormState = {
  businessName: string;
  nit: string;
  phone: string;
  whatsapp: string;
  address: string;
  taxRatePct: string;
  paymentMethods: string[];
  shipping: string;
  returns: string;
};

function toState(s: Settings): FormState {
  return {
    businessName: s.businessName,
    nit: s.nit,
    phone: s.phone,
    whatsapp: s.whatsapp,
    address: s.address ?? "",
    // Mostramos el IVA como porcentaje (0..100) en la UI.
    taxRatePct: String(Math.round(s.taxRate * 10000) / 100),
    paymentMethods: [...s.paymentMethods],
    shipping: s.policies.shipping,
    returns: s.policies.returns,
  };
}

/**
 * Formulario de ajustes del negocio (FUNCTIONAL-SPEC §25).
 *
 * Campos: negocio (nombre, NIT, dirección, teléfono, WhatsApp), métodos de
 * pago activos (checkboxes), % IVA, políticas (rutas). Al hacer submit valida
 * con `SettingsSchema` y emite el `Settings` ya normalizado.
 */
export function SettingsForm({
  initial,
  onSave,
  submitting,
}: SettingsFormProps) {
  const [state, setState] = useState<FormState>(() => toState(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function togglePayment(id: string, checked: boolean) {
    setState((prev) => ({
      ...prev,
      paymentMethods: checked
        ? Array.from(new Set([...prev.paymentMethods, id]))
        : prev.paymentMethods.filter((m) => m !== id),
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pct = Number(state.taxRatePct);
    const raw = {
      businessName: state.businessName,
      nit: state.nit,
      phone: state.phone,
      whatsapp: state.whatsapp,
      address: state.address ? state.address : undefined,
      taxRate: Number.isFinite(pct) ? pct / 100 : NaN,
      paymentMethods: state.paymentMethods,
      policies: {
        shipping: state.shipping,
        returns: state.returns,
      },
    };
    const parsed = SettingsSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSave(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nombre del negocio"
          required
          value={state.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          error={errors.businessName}
        />
        <Input
          label="NIT"
          required
          value={state.nit}
          onChange={(e) => set("nit", e.target.value)}
          error={errors.nit}
        />
        <Input
          label="Teléfono"
          required
          value={state.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
        />
        <Input
          label="WhatsApp"
          required
          value={state.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
          error={errors.whatsapp}
        />
        <div className="md:col-span-2">
          <Input
            label="Dirección"
            value={state.address}
            onChange={(e) => set("address", e.target.value)}
            error={errors.address}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Input
          label="% IVA"
          required
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={state.taxRatePct}
          onChange={(e) => set("taxRatePct", e.target.value)}
          error={errors.taxRate}
          hint="Porcentaje aplicado al subtotal (0 = exento)"
        />
      </section>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 block text-[13px] font-semibold text-ink">
          Métodos de pago activos
        </legend>
        <div className="grid gap-2 md:grid-cols-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 text-[14px] text-ink"
            >
              <input
                type="checkbox"
                checked={state.paymentMethods.includes(opt.id)}
                onChange={(e) => togglePayment(opt.id, e.target.checked)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <section className="grid gap-4 md:grid-cols-2">
        <Input
          label="Política de envíos (URL)"
          required
          value={state.shipping}
          onChange={(e) => set("shipping", e.target.value)}
          error={errors["policies.shipping"]}
        />
        <Input
          label="Política de devoluciones (URL)"
          required
          value={state.returns}
          onChange={(e) => set("returns", e.target.value)}
          error={errors["policies.returns"]}
        />
      </section>

      <div className="flex justify-end border-t border-card-border pt-4">
        <Button type="submit" variant="primary" isLoading={submitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
