import { z } from "zod";

/**
 * Schemas de dominio del pedido (`Order`).
 *
 * Todo lo que entra al repositorio o sale a la UI pasa por estos schemas Zod.
 * Cuando se migre a Supabase, los tipos generados se contrastan con estos
 * (los schemas son la fuente de verdad del dominio).
 */

/* ---------- Status ---------- */

export const OrderStatusSchema = z.enum([
  "draft",
  "pending_payment",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "closed",
  "cancelled",
  "refunded",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/* ---------- Pieces ---------- */

export const OrderLineSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
  lineTotal: z.number().int().nonnegative(),
});
export type OrderLine = z.infer<typeof OrderLineSchema>;

export const OrderTotalsSchema = z.object({
  subtotal: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
  shipping: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});
export type OrderTotals = z.infer<typeof OrderTotalsSchema>;

export const OrderContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});
export type OrderContact = z.infer<typeof OrderContactSchema>;

export const OrderShippingSchema = z.object({
  // address/city/department pueden estar vacíos cuando la orden está en
  // estado `draft` (carrito abandonado, sin checkout completo). Los checks
  // reales de "está completo" se hacen al pasar a `pending_payment` y los
  // valida el form de checkout (ShippingAddressSchema en features/checkout).
  address: z.string().default(""),
  city: z.string().default(""),
  department: z.string().default(""),
  postalCode: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});
export type OrderShipping = z.infer<typeof OrderShippingSchema>;

export const OrderPaymentMethodSchema = z.enum([
  "credit_card",
  "pse",
  "nequi",
  "cash_on_delivery",
  "payu",
  "mock",
]);
export type OrderPaymentMethod = z.infer<typeof OrderPaymentMethodSchema>;

export const OrderPaymentSchema = z.object({
  method: OrderPaymentMethodSchema,
  last4: z.string().length(4).optional(),
  provider: z.string().optional(),
  reference: z.string().optional(),
  transactionId: z.string().optional(),
  state: z.string().optional(),
});
export type OrderPayment = z.infer<typeof OrderPaymentSchema>;

export const OrderInternalNoteSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  text: z.string().min(1),
  createdAt: z.string(),
});
export type OrderInternalNote = z.infer<typeof OrderInternalNoteSchema>;

/* ---------- Order completo ---------- */

export const OrderSchema = z.object({
  id: z.string().min(1),
  userId: z.string().optional(),
  status: OrderStatusSchema,
  lines: z.array(OrderLineSchema).min(1),
  totals: OrderTotalsSchema,
  contact: OrderContactSchema,
  shipping: OrderShippingSchema,
  payment: OrderPaymentSchema,
  couponCode: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.array(OrderInternalNoteSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;
