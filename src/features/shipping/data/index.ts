/**
 * Selector del repositorio de zonas de envío.
 *
 * Cuando `NEXT_PUBLIC_DATA_BACKEND === "supabase"` se usa el repo de Supabase;
 * por defecto cae al mock con `localStorage`.
 */

import { MockShippingZoneRepo } from "./mock.repo";
import { SupabaseShippingZoneRepo } from "./supabase.repo";
import type { ShippingZoneRepository } from "./ports";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const shippingRepo: ShippingZoneRepository =
  backend === "supabase"
    ? new SupabaseShippingZoneRepo()
    : new MockShippingZoneRepo();
