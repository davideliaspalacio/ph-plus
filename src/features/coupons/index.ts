/**
 * API pública de la feature `coupons`.
 *
 * Cualquier consumidor externo (otras features, app/) debe importar SIEMPRE
 * desde acá y nunca desde subpaths internos.
 */

export {
  CouponSchema,
  CouponTypeSchema,
  type Coupon,
  type CouponType,
} from "./domain/coupon";

export {
  validateCoupon,
  computeDiscount,
  type ValidationReason,
  type ValidationResult,
  type ValidateContext,
  type DiscountResult,
} from "./domain/apply";

export { couponRepo } from "./data";
export type { CouponRepository, NewCouponInput } from "./data/ports";
