/**
 * API pública de la feature `checkout`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  CheckoutFormSchema,
  ContactSchema,
  ShippingAddressSchema,
  PaymentSchema,
  COLOMBIAN_DEPARTMENTS,
  PAYMENT_METHODS,
  type CheckoutFormInput,
  type ContactInput,
  type ShippingAddressInput,
  type PaymentInput,
  type CheckoutPaymentMethod,
} from "./domain/schema";

export {
  combineTotals,
  submitOrder,
  type CombineTotalsInput,
  type CombinedCheckoutSnapshot,
  type SerializableTotals,
  type SubmitOrderInput,
  type SubmitOrderDeps,
} from "./domain/totals";

export {
  useCheckout,
  CHECKOUT_STORAGE_KEY,
  type CheckoutDraftState,
} from "./store/useCheckout";

export { CheckoutForm, type CheckoutFormProps } from "./ui/CheckoutForm";
export {
  CheckoutSummary,
  type CheckoutSummaryProps,
} from "./ui/CheckoutSummary";
export { CouponInput, type CouponInputProps } from "./ui/CouponInput";
