/**
 * Repositorio mock de zonas de envío sobre `localStorage` namespaced.
 *
 * - Namespace: `phplus.db.shipping-zones.v1` (cada zona es una entrada
 *   `phplus.db.shipping-zones.v1:<id>`).
 * - Si el namespace está vacío al primer `list()`, siembra 4 zonas alineadas
 *   con el contenido del prototipo en `app/envios/page.tsx`.
 * - `archive(id)` marca `isActive: false` (no borra) — el día que migremos a
 *   Supabase mantenemos historial.
 */

import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";

import type { NewShippingZone, ShippingZone } from "../domain/zone";
import type { ShippingZoneRepository } from "./ports";

export const SHIPPING_ZONES_STORAGE_PREFIX = "phplus.db.shipping-zones.v1";

const FREE_THRESHOLD = 120_000;

export const SHIPPING_ZONES_SEED: ShippingZone[] = [
  {
    id: "zone-bogota",
    name: "Bogotá D.C.",
    regions: ["Bogotá", "Bogota", "Bogotá D.C."],
    cost: 8_000,
    leadTimeDaysMin: 1,
    leadTimeDaysMax: 2,
    freeShippingThreshold: FREE_THRESHOLD,
    isActive: true,
  },
  {
    id: "zone-cundinamarca",
    name: "Cundinamarca cercana",
    regions: [
      "Chía",
      "Cota",
      "Funza",
      "Mosquera",
      "Cajicá",
      "La Calera",
      "Soacha",
      "Zipaquirá",
      "Facatativá",
      "Madrid",
      "Fusagasugá",
    ],
    cost: 12_000,
    leadTimeDaysMin: 2,
    leadTimeDaysMax: 3,
    freeShippingThreshold: FREE_THRESHOLD,
    isActive: true,
  },
  {
    id: "zone-ciudades-principales",
    name: "Ciudades principales",
    regions: [
      "Medellín",
      "Cali",
      "Barranquilla",
      "Bucaramanga",
      "Manizales",
      "Pereira",
      "Armenia",
    ],
    cost: 18_000,
    leadTimeDaysMin: 3,
    leadTimeDaysMax: 5,
    isActive: true,
  },
  {
    id: "zone-resto-pais",
    name: "Resto del país",
    regions: [
      "Cartagena",
      "Santa Marta",
      "Cúcuta",
      "Ibagué",
      "Neiva",
      "Pasto",
      "Villavicencio",
    ],
    cost: 22_000,
    leadTimeDaysMin: 4,
    leadTimeDaysMax: 7,
    isActive: true,
  },
];

export class MockShippingZoneRepo implements ShippingZoneRepository {
  private store = makeNamespacedStorage<ShippingZone>(
    SHIPPING_ZONES_STORAGE_PREFIX,
  );

  private ensureSeeded(): void {
    if (this.store.ids().length === 0) {
      for (const zone of SHIPPING_ZONES_SEED) {
        this.store.set(zone.id, zone);
      }
    }
  }

  async list(): Promise<ShippingZone[]> {
    this.ensureSeeded();
    return this.store.list();
  }

  async byId(id: string): Promise<ShippingZone | null> {
    this.ensureSeeded();
    return this.store.get(id);
  }

  async create(input: NewShippingZone): Promise<ShippingZone> {
    this.ensureSeeded();
    const zone: ShippingZone = { ...input, id: newId() };
    this.store.set(zone.id, zone);
    return zone;
  }

  async update(
    id: string,
    patch: Partial<NewShippingZone>,
  ): Promise<ShippingZone> {
    this.ensureSeeded();
    const current = this.store.get(id);
    if (!current) {
      throw new Error(`ShippingZone not found: ${id}`);
    }
    const next: ShippingZone = { ...current, ...patch, id: current.id };
    this.store.set(id, next);
    return next;
  }

  async archive(id: string): Promise<void> {
    this.ensureSeeded();
    const current = this.store.get(id);
    if (!current) return;
    this.store.set(id, { ...current, isActive: false });
  }
}
