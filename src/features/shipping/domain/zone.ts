/**
 * Esquema de una zona de envío.
 *
 * Una zona agrupa un conjunto de regiones (ciudades / municipios) que comparten
 * costo de envío, tiempo estimado de entrega y, opcionalmente, un umbral de
 * envío gratis. Las zonas pueden estar activas o archivadas.
 */

import { z } from "zod";

const ShippingZoneBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  regions: z.array(z.string().min(1)).min(1),
  cost: z.number().int().nonnegative(),
  leadTimeDaysMin: z.number().int().nonnegative(),
  leadTimeDaysMax: z.number().int().nonnegative(),
  freeShippingThreshold: z.number().int().positive().optional(),
  isActive: z.boolean(),
});

const leadTimeRefinement = {
  check: (z: { leadTimeDaysMin: number; leadTimeDaysMax: number }) =>
    z.leadTimeDaysMax >= z.leadTimeDaysMin,
  message: "leadTimeDaysMax debe ser >= leadTimeDaysMin",
  path: ["leadTimeDaysMax"] as const,
};

export const ShippingZoneSchema = ShippingZoneBaseSchema.refine(
  leadTimeRefinement.check,
  { message: leadTimeRefinement.message, path: [...leadTimeRefinement.path] },
);

export type ShippingZone = z.infer<typeof ShippingZoneSchema>;

export const NewShippingZoneSchema = ShippingZoneBaseSchema.omit({
  id: true,
}).refine(leadTimeRefinement.check, {
  message: leadTimeRefinement.message,
  path: [...leadTimeRefinement.path],
});
export type NewShippingZone = z.infer<typeof NewShippingZoneSchema>;
