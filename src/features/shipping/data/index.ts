/**
 * Selector del repositorio de zonas de envío.
 *
 * Hoy sólo está el mock. Cuando exista `SupabaseShippingZoneRepo` se elige por
 * `NEXT_PUBLIC_DATA_BACKEND`, igual que el resto de features.
 */

import { MockShippingZoneRepo } from "./mock.repo";
import type { ShippingZoneRepository } from "./ports";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const shippingRepo: ShippingZoneRepository =
  backend === "supabase"
    ? new MockShippingZoneRepo() // TODO: SupabaseShippingZoneRepo
    : new MockShippingZoneRepo();
