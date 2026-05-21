import { z } from "zod";

/**
 * Schema de un cupón de descuento.
 *
 * - `code` se normaliza siempre a uppercase + trim. Es la llave funcional
 *   con la que el cliente lo aplica en el carrito.
 * - `type` define el comportamiento del descuento:
 *   - `percent`: porcentaje sobre el subtotal (0..100).
 *   - `fixed`:   monto fijo en pesos (capeado al subtotal).
 *   - `free_shipping`: dispara envío gratis (no toca subtotal).
 * - `startsAt` / `endsAt` son ISO strings.
 * - `productIds` y `categoryIds` son opcionales para limitar el alcance
 *   del cupón a productos/categorías específicas (Sprint posterior los usa).
 */
export const CouponTypeSchema = z.enum(["percent", "fixed", "free_shipping"]);
export type CouponType = z.infer<typeof CouponTypeSchema>;

export const CouponSchema = z.object({
  id: z.string().min(1),
  code: z
    .string()
    .min(1)
    .transform((s) => s.trim().toUpperCase()),
  type: CouponTypeSchema,
  value: z.number().nonnegative(),
  startsAt: z.string(),
  endsAt: z.string(),
  minSubtotal: z.number().int().nonnegative(),
  maxUses: z.number().int().nonnegative(),
  maxUsesPerCustomer: z.number().int().nonnegative(),
  usedCount: z.number().int().nonnegative(),
  isActive: z.boolean(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type Coupon = z.infer<typeof CouponSchema>;
