/**
 * Orquestación de pricing y submit del checkout.
 *
 * `combineTotals` es un wrapper sobre `computeCheckoutPricing` que devuelve un
 * snapshot serializable (sin referencias circulares) ideal para alimentar el
 * resumen del UI y la creación del pedido.
 *
 * `submitOrder` arma el `NewOrderInput` a partir del carrito + datos del form
 * + cupón? + zona?, y lo entrega al repo via dependency injection (para que
 * los tests puedan mockear sin pegarle a `localStorage`).
 */

import {
  computeCheckoutPricing,
  type CheckoutPricing,
  type CartItemInput,
  type ProductLike,
  type ProductLookup,
} from "@/src/features/cart";
import type { Coupon } from "@/src/features/coupons";
import type { ShippingZone } from "@/src/features/shipping";
import type {
  NewOrderInput,
  Order,
  OrderLine,
  OrderPaymentMethod,
  OrderRepository,
} from "@/src/features/orders";
import type {
  ContactInput,
  PaymentInput,
  ShippingAddressInput,
} from "./schema";

export interface CombineTotalsInput<P extends ProductLike = ProductLike> {
  items: CartItemInput[];
  lookup: ProductLookup<P>;
  coupon?: Coupon | null;
  shippingZones?: ShippingZone[];
  city?: string;
  now?: Date;
}

export interface SerializableTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponReason: string | null;
  shippingFreeApplied: boolean;
  shippingZoneId: string | null;
  totalItems: number;
}

/**
 * Snapshot listo para serializar (orderRepo.create / persist).
 */
export interface CombinedCheckoutSnapshot<P extends ProductLike = ProductLike> {
  totals: SerializableTotals;
  lines: CheckoutPricing<P>["lines"];
  qualifiesForFreeShipping: boolean;
}

export function combineTotals<P extends ProductLike = ProductLike>(
  input: CombineTotalsInput<P>,
): CombinedCheckoutSnapshot<P> {
  const pricing = computeCheckoutPricing<P>(input);
  return {
    totals: {
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      shipping: pricing.shippingCost,
      total: pricing.total,
      couponReason: pricing.couponReason,
      shippingFreeApplied: pricing.shippingFreeApplied,
      shippingZoneId: pricing.shippingZoneId,
      totalItems: pricing.totalItems,
    },
    lines: pricing.lines,
    qualifiesForFreeShipping: pricing.qualifiesForFreeShipping,
  };
}

export interface SubmitOrderInput<P extends ProductLike = ProductLike> {
  items: CartItemInput[];
  contact: ContactInput;
  shipping: ShippingAddressInput;
  payment: PaymentInput;
  coupon?: Coupon | null;
  shippingZones?: ShippingZone[];
  userId?: string;
  now?: Date;
}

export interface SubmitOrderDeps<P extends ProductLike = ProductLike> {
  orderRepo: OrderRepository;
  lookup: ProductLookup<P>;
}

/** "Sin departamento" fallback aceptado por OrderShippingSchema (min(1)). */
const DEFAULT_DEPARTMENT = "Sin especificar";

/**
 * Mapea el método del form al `OrderPaymentMethod`. Ambos enums coinciden, pero
 * dejamos esta función explícita para que el typecheck se queje si divergen.
 */
function mapPaymentMethod(m: PaymentInput["method"]): OrderPaymentMethod {
  return m;
}

export async function submitOrder<P extends ProductLike = ProductLike>(
  input: SubmitOrderInput<P>,
  deps: SubmitOrderDeps<P>,
): Promise<Order> {
  const snapshot = combineTotals<P>({
    items: input.items,
    lookup: deps.lookup,
    coupon: input.coupon,
    shippingZones: input.shippingZones,
    city: input.shipping.city,
    now: input.now,
  });

  if (snapshot.lines.length === 0) {
    throw new Error("EMPTY_CART");
  }

  const lines: OrderLine[] = snapshot.lines.map((l) => {
    const title =
      (l.product as ProductLike & { title?: string }).title ?? l.product.slug;
    return {
      slug: l.product.slug,
      title,
      quantity: l.item.quantity,
      unitPrice: l.product.priceValue,
      lineTotal: l.lineTotal,
    };
  });

  const couponCode = input.coupon?.code;

  const newOrder: NewOrderInput = {
    userId: input.userId,
    status: "pending_payment",
    lines,
    totals: {
      subtotal: snapshot.totals.subtotal,
      discount: snapshot.totals.discount,
      shipping: snapshot.totals.shipping,
      total: snapshot.totals.total,
    },
    contact: {
      name: input.contact.name,
      email: input.contact.email,
      phone: input.contact.phone,
    },
    shipping: {
      address: input.shipping.address,
      city: input.shipping.city,
      department: input.shipping.department ?? DEFAULT_DEPARTMENT,
      postalCode: input.shipping.postalCode ?? "",
      notes: input.shipping.notes ?? "",
    },
    payment: {
      method: mapPaymentMethod(input.payment.method),
      last4:
        input.payment.method === "credit_card" && input.payment.card4Last
          ? input.payment.card4Last
          : undefined,
    },
    couponCode: couponCode && snapshot.totals.couponReason === "OK"
      ? couponCode
      : undefined,
  };

  return deps.orderRepo.create(newOrder);
}
