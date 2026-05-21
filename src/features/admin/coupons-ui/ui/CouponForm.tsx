"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button, Input, Select } from "@/src/shared/ui";
import {
  CouponSchema,
  type Coupon,
  type CouponType,
} from "@/src/features/coupons";

/**
 * Input que emite el form al `onSubmit`. Es el shape del Coupon sin `id` ni
 * `usedCount` (esos los maneja el repo).
 */
export type CouponFormInput = Omit<Coupon, "id" | "usedCount">;

export interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (input: CouponFormInput) => void;
  onCancel: () => void;
  submitting?: boolean;
}

type FormState = {
  code: string;
  type: CouponType;
  value: string;
  startsAt: string;
  endsAt: string;
  minSubtotal: string;
  maxUses: string;
  maxUsesPerCustomer: string;
  isActive: boolean;
};

const TYPE_OPTIONS = [
  { value: "percent", label: "Porcentaje" },
  { value: "fixed", label: "Monto fijo" },
  { value: "free_shipping", label: "Envío gratis" },
];

function isoToDateInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateInputToIso(value: string, endOfDay = false): string {
  if (!value) return "";
  const suffix = endOfDay ? "T23:59:59.000Z" : "T00:00:00.000Z";
  return `${value}${suffix}`;
}

function toInitialState(coupon?: Coupon): FormState {
  return {
    code: coupon?.code ?? "",
    type: coupon?.type ?? "percent",
    value: coupon ? String(coupon.value) : "0",
    startsAt: coupon ? isoToDateInput(coupon.startsAt) : "",
    endsAt: coupon ? isoToDateInput(coupon.endsAt) : "",
    minSubtotal: coupon ? String(coupon.minSubtotal) : "0",
    maxUses: coupon ? String(coupon.maxUses) : "0",
    maxUsesPerCustomer: coupon ? String(coupon.maxUsesPerCustomer) : "0",
    isActive: coupon?.isActive ?? true,
  };
}

/**
 * Schema usado por el form. Reutilizamos CouponSchema y le quitamos los
 * campos que el form no maneja (id, usedCount). Además agregamos la
 * validación cruzada `endsAt >= startsAt`.
 */
const CouponFormSchema = CouponSchema.omit({ id: true, usedCount: true }).refine(
  (data) => new Date(data.endsAt).getTime() >= new Date(data.startsAt).getTime(),
  { path: ["endsAt"], message: "La fecha de fin debe ser mayor o igual al inicio" },
);

/**
 * Formulario de creación / edición de cupones.
 *
 * - El sufijo del campo `value` cambia según `type`: "%" para `percent`,
 *   "$" para `fixed`, y se oculta cuando es `free_shipping`.
 * - Valida con `CouponSchema` (reutilizado de la feature `coupons`) más una
 *   regla extra de end >= start.
 */
export function CouponForm({
  coupon,
  onSubmit,
  onCancel,
  submitting,
}: CouponFormProps) {
  const [state, setState] = useState<FormState>(() => toInitialState(coupon));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = {
      code: state.code,
      type: state.type,
      value: state.type === "free_shipping" ? 0 : Number(state.value),
      startsAt: dateInputToIso(state.startsAt, false),
      endsAt: dateInputToIso(state.endsAt, true),
      minSubtotal: Number(state.minSubtotal),
      maxUses: Number(state.maxUses),
      maxUsesPerCustomer: Number(state.maxUsesPerCustomer),
      isActive: state.isActive,
    };

    const parsed = CouponFormSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of (parsed.error as z.ZodError).issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  const showValue = state.type !== "free_shipping";
  const valueSuffix = state.type === "percent" ? "%" : "$";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Código"
          required
          value={state.code}
          onChange={(e) => set("code", e.target.value)}
          error={errors.code}
          hint="Se normaliza a mayúsculas"
        />
        <Select
          label="Tipo"
          options={TYPE_OPTIONS}
          value={state.type}
          onChange={(e) => set("type", e.target.value as CouponType)}
          error={errors.type}
        />
        {showValue && (
          <Input
            label="Valor"
            required
            type="number"
            min={0}
            value={state.value}
            onChange={(e) => set("value", e.target.value)}
            error={errors.value}
            rightAddon={valueSuffix}
          />
        )}
        <Input
          label="Inicia"
          required
          type="date"
          value={state.startsAt}
          onChange={(e) => set("startsAt", e.target.value)}
          error={errors.startsAt}
        />
        <Input
          label="Finaliza"
          required
          type="date"
          value={state.endsAt}
          onChange={(e) => set("endsAt", e.target.value)}
          error={errors.endsAt}
        />
        <Input
          label="Mínimo de compra"
          type="number"
          min={0}
          value={state.minSubtotal}
          onChange={(e) => set("minSubtotal", e.target.value)}
          error={errors.minSubtotal}
        />
        <Input
          label="Máximo de usos totales"
          type="number"
          min={0}
          value={state.maxUses}
          onChange={(e) => set("maxUses", e.target.value)}
          error={errors.maxUses}
        />
        <Input
          label="Máximo de usos por cliente"
          type="number"
          min={0}
          value={state.maxUsesPerCustomer}
          onChange={(e) => set("maxUsesPerCustomer", e.target.value)}
          error={errors.maxUsesPerCustomer}
        />
        <label className="mt-2 flex items-center gap-2 text-[14px] text-ink">
          <input
            type="checkbox"
            checked={state.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
          />
          Activo
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-card-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={submitting}>
          {coupon ? "Guardar cambios" : "Crear cupón"}
        </Button>
      </div>
    </form>
  );
}
