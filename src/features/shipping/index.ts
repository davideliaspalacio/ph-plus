/**
 * API pública de la feature `shipping`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  ShippingZoneSchema,
  NewShippingZoneSchema,
  type ShippingZone,
  type NewShippingZone,
} from "./domain/zone";

export {
  calculateShipping,
  matchZone,
  normalizeCity,
  type ShippingCalculation,
} from "./domain/calculate";

export { shippingRepo } from "./data";
export type { ShippingZoneRepository } from "./data/ports";
export {
  SHIPPING_ZONES_SEED,
  SHIPPING_ZONES_STORAGE_PREFIX,
} from "./data/mock.repo";
