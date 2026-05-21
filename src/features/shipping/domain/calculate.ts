/**
 * Reglas puras de cálculo de envío.
 *
 * - `normalizeCity` neutraliza acentos, casing y espacios sobrantes para
 *   comparar nombres de ciudades de forma tolerante a errores de tipeo.
 * - `matchZone` busca la primera zona activa cuyas `regions` incluyan la
 *   ciudad (ya normalizada).
 * - `calculateShipping` combina lo anterior con la regla de envío gratis
 *   por umbral configurable a nivel de zona.
 */

import type { ShippingZone } from "./zone";

export function normalizeCity(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function matchZone(
  zones: ShippingZone[],
  city: string,
): ShippingZone | null {
  const target = normalizeCity(city);
  if (!target) return null;

  for (const zone of zones) {
    if (!zone.isActive) continue;
    const hit = zone.regions.some((r) => normalizeCity(r) === target);
    if (hit) return zone;
  }
  return null;
}

export type ShippingCalculation =
  | {
      zone: ShippingZone;
      cost: number;
      freeApplied: boolean;
      leadTime: { min: number; max: number };
    }
  | {
      zone: null;
      cost: null;
      freeApplied: false;
      leadTime: null;
    };

export function calculateShipping(input: {
  zones: ShippingZone[];
  city: string;
  subtotal: number;
}): ShippingCalculation {
  const zone = matchZone(input.zones, input.city);
  if (!zone) {
    return { zone: null, cost: null, freeApplied: false, leadTime: null };
  }

  const threshold = zone.freeShippingThreshold;
  const freeApplied =
    typeof threshold === "number" && input.subtotal >= threshold;

  return {
    zone,
    cost: freeApplied ? 0 : zone.cost,
    freeApplied,
    leadTime: { min: zone.leadTimeDaysMin, max: zone.leadTimeDaysMax },
  };
}
