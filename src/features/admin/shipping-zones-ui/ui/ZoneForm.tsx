"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/src/shared/ui";
import type {
  NewShippingZone,
  ShippingZone,
} from "@/src/features/shipping";

export interface ZoneFormProps {
  zone?: ShippingZone;
  onSubmit: (values: NewShippingZone) => void;
  onCancel: () => void;
  submitting?: boolean;
}

type FormState = {
  name: string;
  regionsRaw: string;
  cost: string;
  leadTimeDaysMin: string;
  leadTimeDaysMax: string;
  freeShippingThreshold: string;
  isActive: boolean;
};

function toInitialState(zone?: ShippingZone): FormState {
  return {
    name: zone?.name ?? "",
    regionsRaw: zone?.regions.join(", ") ?? "",
    cost: zone ? String(zone.cost) : "0",
    leadTimeDaysMin: zone ? String(zone.leadTimeDaysMin) : "1",
    leadTimeDaysMax: zone ? String(zone.leadTimeDaysMax) : "2",
    freeShippingThreshold:
      zone?.freeShippingThreshold != null
        ? String(zone.freeShippingThreshold)
        : "",
    isActive: zone ? zone.isActive : true,
  };
}

function parseRegions(raw: string): string[] {
  return raw
    .split(/[,\n]/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
}

/**
 * Formulario de creación / edición de zonas de envío.
 *
 * El campo `regions` se ingresa como texto separado por comas o nuevas líneas
 * y se normaliza a un array al hacer submit. Valida que `leadTimeDaysMin >= 1`
 * y que `leadTimeDaysMax >= leadTimeDaysMin`. `freeShippingThreshold` es
 * opcional: si se deja vacío se envía como `undefined`.
 */
export function ZoneForm({
  zone,
  onSubmit,
  onCancel,
  submitting,
}: ZoneFormProps) {
  const [state, setState] = useState<FormState>(() => toInitialState(zone));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const regions = parseRegions(state.regionsRaw);
    const cost = Number(state.cost);
    const leadTimeDaysMin = Number(state.leadTimeDaysMin);
    const leadTimeDaysMax = Number(state.leadTimeDaysMax);
    const freeShippingThreshold =
      state.freeShippingThreshold.trim() === ""
        ? undefined
        : Number(state.freeShippingThreshold);

    const next: Record<string, string> = {};
    if (state.name.trim().length < 1) next.name = "El nombre es requerido";
    if (regions.length < 1)
      next.regions = "Ingresá al menos una región";
    if (!Number.isFinite(cost) || cost < 0)
      next.cost = "El costo debe ser un número >= 0";
    if (!Number.isFinite(leadTimeDaysMin) || leadTimeDaysMin < 1)
      next.leadTimeDaysMin = "Mín debe ser al menos 1";
    if (!Number.isFinite(leadTimeDaysMax) || leadTimeDaysMax < leadTimeDaysMin)
      next.leadTimeDaysMax = "Máx debe ser >= Mín";
    if (
      freeShippingThreshold !== undefined &&
      (!Number.isFinite(freeShippingThreshold) || freeShippingThreshold <= 0)
    )
      next.freeShippingThreshold = "Umbral debe ser > 0";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});

    onSubmit({
      name: state.name.trim(),
      regions,
      cost,
      leadTimeDaysMin,
      leadTimeDaysMax,
      freeShippingThreshold,
      isActive: state.isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Nombre"
        required
        value={state.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
      />

      <div>
        <label
          htmlFor="zone-form-regions"
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          Regiones *
        </label>
        <textarea
          id="zone-form-regions"
          value={state.regionsRaw}
          onChange={(e) => set("regionsRaw", e.target.value)}
          rows={3}
          placeholder="Separá por coma o nueva línea: Bogotá, Chía, Cota"
          className="w-full rounded-2xl border border-card-border bg-white px-4 py-3 text-[14px] text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        {errors.regions && (
          <p className="mt-1.5 text-[12px] text-red-600">{errors.regions}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Costo (COP)"
          required
          type="number"
          min={0}
          value={state.cost}
          onChange={(e) => set("cost", e.target.value)}
          error={errors.cost}
        />
        <Input
          label="Free shipping a partir de (opcional)"
          type="number"
          min={1}
          value={state.freeShippingThreshold}
          onChange={(e) => set("freeShippingThreshold", e.target.value)}
          error={errors.freeShippingThreshold}
          hint="Dejá vacío si esta zona no tiene envío gratis"
        />
        <Input
          label="Lead time mín (días)"
          required
          type="number"
          min={1}
          value={state.leadTimeDaysMin}
          onChange={(e) => set("leadTimeDaysMin", e.target.value)}
          error={errors.leadTimeDaysMin}
        />
        <Input
          label="Lead time máx (días)"
          required
          type="number"
          min={1}
          value={state.leadTimeDaysMax}
          onChange={(e) => set("leadTimeDaysMax", e.target.value)}
          error={errors.leadTimeDaysMax}
        />
      </div>

      <label className="flex items-center gap-2 text-[14px] text-ink">
        <input
          type="checkbox"
          checked={state.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
        />
        Activa
      </label>

      <div className="flex justify-end gap-3 border-t border-card-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={submitting}>
          {zone ? "Guardar cambios" : "Crear zona"}
        </Button>
      </div>
    </form>
  );
}
