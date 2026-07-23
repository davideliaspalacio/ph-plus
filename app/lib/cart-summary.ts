/**
 * Shim de compatibilidad.
 *
 * La lógica de pricing vive ahora en `@/src/features/cart/domain/pricing`
 * (puro, testeado). Acá envolvemos `buildCartSummary` para que los consumers
 * existentes (carrito, checkout, exito) sigan recibiendo el shape con el
 * `Product` completo del catálogo legacy.
 */

import type { CartItem } from "../components/CartProvider";
import { PRODUCTS, type Product } from "./products";
import {
  buildCartSummary as buildSummaryDomain,
  FREE_SHIPPING_THRESHOLD as DOMAIN_FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT as DOMAIN_SHIPPING_FLAT,
  type CartSummaryOptions,
  type CartSummary as DomainCartSummary,
} from "@/src/features/cart/domain/pricing";

export const SHIPPING_FLAT = DOMAIN_SHIPPING_FLAT;
export const FREE_SHIPPING_THRESHOLD = DOMAIN_FREE_SHIPPING_THRESHOLD;

export type CartLine = {
  item: CartItem;
  product: Product;
  lineTotal: number;
};

export type CartSummary = {
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
};

const productLookup = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export function buildCartSummary(
  items: CartItem[],
  options: CartSummaryOptions = {},
): CartSummary {
  const summary: DomainCartSummary<Product> = buildSummaryDomain<Product>(
    items,
    productLookup,
    options,
  );
  return {
    lines: summary.lines.map((l) => ({
      item: l.item,
      product: l.product,
      lineTotal: l.lineTotal,
    })),
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total,
    freeShippingThreshold: summary.freeShippingThreshold,
    qualifiesForFreeShipping: summary.qualifiesForFreeShipping,
  };
}
