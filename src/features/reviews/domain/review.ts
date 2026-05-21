import { z } from "zod";

/**
 * Schema de un Review de producto.
 *
 * - `productSlug` es la llave funcional con la que se agrupan en la PDP.
 * - `rating` es un entero 1..5.
 * - `text` mínimo 10 caracteres para evitar reviews triviales ("ok").
 * - `status` arranca en `pending` y lo mueve el admin desde la cola de
 *   moderación (Sprint 23). `rejectionReason` se llena cuando se rechaza;
 *   `adminResponse` es la respuesta pública opcional que aparece en PDP.
 * - `createdAt` / `updatedAt` son ISO strings; `updatedAt` se actualiza en
 *   cada transición de estado o cuando el admin responde.
 */

export const ReviewStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const ReviewSchema = z.object({
  id: z.string().min(1),
  productSlug: z.string().min(1),
  userId: z.string().min(1).optional(),
  authorName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1),
  text: z.string().min(10),
  photo: z.string().optional(),
  recommends: z.boolean(),
  status: ReviewStatusSchema,
  rejectionReason: z.string().optional(),
  adminResponse: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;
