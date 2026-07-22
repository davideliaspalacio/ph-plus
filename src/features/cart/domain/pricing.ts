/**
 * Reglas puras de pricing del carrito.
 *
 * No depende de React, ni de Next, ni del shape completo del Product del catálogo:
 * recibe un `lookup` que entrega el `priceValue` por slug. Eso lo mantiene testeable
 * y reusable cuando migremos a Supabase (el repo de catálogo cumple la función de lookup).
 */

export const SHIPPING_FLAT = 11_000;
/** Retenido por compatibilidad de tipos; PH PLUS ya no maneja envío gratis. */
export const FREE_SHIPPING_THRESHOLD = 120_000;

export type CartItemInput = {
  slug: string;
  quantity: number;
};

export type ProductLike = {
  slug: string;
  priceValue: number;
};

export type CartLine<P extends ProductLike = ProductLike> = {
  item: CartItemInput;
  product: P;
  lineTotal: number;
};

export type CartSummary<P extends ProductLike = ProductLike> = {
  lines: CartLine<P>[];
  subtotal: number;
  shipping: number;
  total: number;
  totalItems: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
  amountToFreeShipping: number;
};

export type ProductLookup<P extends ProductLike = ProductLike> = (
  slug: string,
) => P | undefined;

export type CartSummaryOptions = {
  shippingCost?: number | null;
};

export function buildCartSummary<P extends ProductLike = ProductLike>(
  items: CartItemInput[],
  lookup: ProductLookup<P>,
  options: CartSummaryOptions = {},
): CartSummary<P> {
  const lines: CartLine<P>[] = [];

  for (const item of items) {
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) continue;
    const product = lookup(item.slug);
    if (!product) continue;
    lines.push({
      item,
      product,
      lineTotal: product.priceValue * item.quantity,
    });
  }

  const subtotal = lines.reduce((acc, l) => acc + l.lineTotal, 0);
  const totalItems = lines.reduce((acc, l) => acc + l.item.quantity, 0);
  const qualifiesForFreeShipping = false;
  const shipping =
    lines.length === 0
      ? 0
      : typeof options.shippingCost === "number"
        ? Math.max(0, options.shippingCost)
        : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const amountToFreeShipping = 0;

  return {
    lines,
    subtotal,
    shipping,
    total,
    totalItems,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    qualifiesForFreeShipping,
    amountToFreeShipping,
  };
}
