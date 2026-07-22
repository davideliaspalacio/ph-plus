/**
 * API pública de la feature `cart`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  useCart,
  CART_STORAGE_KEY,
  type CartItem,
  type CartState,
} from "./store/useCart";

export {
  buildCartSummary,
  SHIPPING_FLAT,
  FREE_SHIPPING_THRESHOLD,
  type CartLine,
  type CartSummary,
  type CartSummaryOptions,
  type CartItemInput,
  type ProductLike,
  type ProductLookup,
} from "./domain/pricing";

export {
  computeCheckoutPricing,
  type CheckoutPricing,
  type CheckoutPricingInput,
} from "./domain/checkout-pricing";
