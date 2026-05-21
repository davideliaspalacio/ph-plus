import type { Coupon } from "./coupon";

/**
 * Reglas puras de aplicación de cupones.
 *
 * `validateCoupon` decide si un cupón puede aplicarse en un contexto dado
 * (fecha actual + subtotal del carrito). Retorna un discriminated union
 * para que el caller pueda mostrar mensajes específicos.
 *
 * `computeDiscount` calcula el descuento monetario suponiendo que el cupón
 * ya pasó la validación. No mira fechas ni límites — sólo el tipo y valor.
 */

export type ValidationReason =
  | "NOT_STARTED"
  | "EXPIRED"
  | "INACTIVE"
  | "MIN_SUBTOTAL_NOT_REACHED"
  | "MAX_USES_REACHED";

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: ValidationReason };

export interface ValidateContext {
  now: Date;
  subtotal: number;
}

export function validateCoupon(
  coupon: Coupon,
  ctx: ValidateContext,
): ValidationResult {
  if (!coupon.isActive) return { ok: false, reason: "INACTIVE" };

  const startsAt = new Date(coupon.startsAt).getTime();
  const endsAt = new Date(coupon.endsAt).getTime();
  const now = ctx.now.getTime();

  if (now < startsAt) return { ok: false, reason: "NOT_STARTED" };
  if (now > endsAt) return { ok: false, reason: "EXPIRED" };

  if (ctx.subtotal < coupon.minSubtotal) {
    return { ok: false, reason: "MIN_SUBTOTAL_NOT_REACHED" };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { ok: false, reason: "MAX_USES_REACHED" };
  }

  return { ok: true };
}

export interface DiscountResult {
  discountSubtotal: number;
  freeShipping: boolean;
}

export function computeDiscount(
  coupon: Coupon,
  subtotal: number,
): DiscountResult {
  if (coupon.type === "free_shipping") {
    return { discountSubtotal: 0, freeShipping: true };
  }
  if (coupon.type === "percent") {
    const raw = Math.round((subtotal * coupon.value) / 100);
    return {
      discountSubtotal: Math.min(raw, subtotal),
      freeShipping: false,
    };
  }
  // fixed
  return {
    discountSubtotal: Math.min(coupon.value, subtotal),
    freeShipping: false,
  };
}
