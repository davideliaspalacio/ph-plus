/**
 * Puerto del repositorio de zonas de envío.
 *
 * Implementaciones: `mock.repo.ts` (localStorage namespaced) hoy,
 * `supabase.repo.ts` mañana. La feature consume sólo este contrato.
 */

import type { NewShippingZone, ShippingZone } from "../domain/zone";

export interface ShippingZoneRepository {
  list(): Promise<ShippingZone[]>;
  byId(id: string): Promise<ShippingZone | null>;
  create(input: NewShippingZone): Promise<ShippingZone>;
  update(id: string, patch: Partial<NewShippingZone>): Promise<ShippingZone>;
  archive(id: string): Promise<void>;
}
