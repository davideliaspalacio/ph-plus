/**
 * Pricing extendido del carrito para el flujo de checkout.
 *
 * Compone tres dominios puros — pricing simple, coupons y shipping — en un
 * único snapshot listo para alimentar el resumen del checkout, sin tocar el
 * `buildCartSummary` original (que se mantiene como contrato simple).
 *
 * Reglas:
 *  - El cupón se valida con la fecha inyectada (`now`) para que sea testeable.
 *  - Si no hay zona/ciudad o no matchea, se usa el `shipping` del summary
 *    como fallback.
 *  - El total nunca baja de `shippingCost` (subtotal descontado se clampa a 0).
 */

import type { Coupon } from "@/src/features/coupons";
import { computeDiscount, validateCoupon } from "@/src/features/coupons";
import type { ShippingZone } from "@/src/features/shipping";
import { calculateShipping } from "@/src/features/shipping";
import {
  buildCartSummary,
  type CartItemInput,
  type ProductLike,
  type ProductLookup,
} from "./pricing";

export interface CheckoutPricingInput<P extends ProductLike = ProductLike> {
  items: CartItemInput[];
  lookup: ProductLookup<P>;
  coupon?: Coupon | null;
  shippingZones?: ShippingZone[];
  city?: string;
  now?: Date;
}

export interface CheckoutPricing<P extends ProductLike = ProductLike> {
  subtotal: number;
  discount: number;
  couponReason: string | null;
  shippingCost: number;
  shippingZoneId: string | null;
  shippingFreeApplied: boolean;
  total: number;
  totalItems: number;
  lines: ReturnType<typeof buildCartSummary<P>>["lines"];
  qualifiesForFreeShipping: boolean;
}

export function computeCheckoutPricing<P extends ProductLike = ProductLike>(
  input: CheckoutPricingInput<P>,
): CheckoutPricing<P> {
  const summary = buildCartSummary<P>(input.items, input.lookup);

  // --- coupon ---
  let discount = 0;
  let couponReason: string | null = "NO_COUPON";

  if (input.coupon) {
    const validation = validateCoupon(input.coupon, {
      subtotal: summary.subtotal,
      now: input.now ?? new Date(),
    });

    if (validation.ok) {
      couponReason = "OK";
      const d = computeDiscount(input.coupon, summary.subtotal);
      discount = d.discountSubtotal;
    } else {
      couponReason = validation.reason;
    }
  }

  const subtotal = summary.subtotal;
  const discountedSubtotal = subtotal - discount;

  // --- shipping ---
  let shippingCost: number;
  let shippingZoneId: string | null;
  let shippingFreeApplied: boolean;

  if (input.shippingZones && input.shippingZones.length > 0 && input.city) {
    const result = calculateShipping({
      zones: input.shippingZones,
      city: input.city,
      subtotal: discountedSubtotal,
    });
    if (result.zone) {
      shippingCost = result.cost ?? 0;
      shippingZoneId = result.zone.id;
      shippingFreeApplied = result.freeApplied;
    } else {
      shippingCost = summary.shipping;
      shippingZoneId = null;
      shippingFreeApplied = false;
    }
  } else {
    shippingCost = summary.shipping;
    shippingZoneId = null;
    shippingFreeApplied = false;
  }

  const total = Math.max(0, discountedSubtotal) + shippingCost;

  return {
    subtotal,
    discount,
    couponReason,
    shippingCost,
    shippingZoneId,
    shippingFreeApplied,
    total,
    totalItems: summary.totalItems,
    lines: summary.lines,
    qualifiesForFreeShipping: summary.qualifiesForFreeShipping,
  };
}
