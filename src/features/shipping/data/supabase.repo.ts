import {
  ShippingZoneSchema,
  type NewShippingZone,
  type ShippingZone,
} from "../domain/zone";
import type { ShippingZoneRepository } from "./ports";

/**
 * Repo de zonas de envío contra Supabase.
 *
 * La tabla `public.shipping_zones` usa snake_case
 * (lead_time_days_min/max, free_shipping_threshold, is_active). Acá
 * mapeamos a `ShippingZone` (camelCase) que es el shape que consume el
 * dominio puro de cálculo de envío.
 */

interface ShippingZoneDbRow {
  id: string;
  name: string;
  regions: unknown;
  cost: number | string;
  lead_time_days_min: number;
  lead_time_days_max: number;
  free_shipping_threshold: number | string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function mapRow(row: ShippingZoneDbRow): ShippingZone {
  return ShippingZoneSchema.parse({
    id: row.id,
    name: row.name,
    regions: toStringArray(row.regions),
    cost: Number(row.cost),
    leadTimeDaysMin: row.lead_time_days_min,
    leadTimeDaysMax: row.lead_time_days_max,
    freeShippingThreshold:
      row.free_shipping_threshold != null
        ? Number(row.free_shipping_threshold)
        : undefined,
    isActive: row.is_active,
  });
}

function newInputToDb(input: NewShippingZone): Record<string, unknown> {
  return {
    name: input.name,
    regions: input.regions,
    cost: input.cost,
    lead_time_days_min: input.leadTimeDaysMin,
    lead_time_days_max: input.leadTimeDaysMax,
    free_shipping_threshold: input.freeShippingThreshold ?? null,
    is_active: input.isActive,
  };
}

function patchToDb(patch: Partial<NewShippingZone>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (patch.name !== undefined) out.name = patch.name;
  if (patch.regions !== undefined) out.regions = patch.regions;
  if (patch.cost !== undefined) out.cost = patch.cost;
  if (patch.leadTimeDaysMin !== undefined) {
    out.lead_time_days_min = patch.leadTimeDaysMin;
  }
  if (patch.leadTimeDaysMax !== undefined) {
    out.lead_time_days_max = patch.leadTimeDaysMax;
  }
  if (patch.freeShippingThreshold !== undefined) {
    out.free_shipping_threshold = patch.freeShippingThreshold ?? null;
  }
  if (patch.isActive !== undefined) out.is_active = patch.isActive;
  return out;
}

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

export class SupabaseShippingZoneRepo implements ShippingZoneRepository {
  async list(): Promise<ShippingZone[]> {
    const supabase = await getClient();
    const { data, error } = await supabase.from("shipping_zones").select("*");

    if (error) {
      throw new Error(`SupabaseShippingZoneRepo.list: ${error.message}`);
    }
    const rows = (data ?? []) as unknown as ShippingZoneDbRow[];
    return rows.map(mapRow);
  }

  async byId(id: string): Promise<ShippingZone | null> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("shipping_zones")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`SupabaseShippingZoneRepo.byId: ${error.message}`);
    }
    if (!data) return null;
    return mapRow(data as unknown as ShippingZoneDbRow);
  }

  async create(input: NewShippingZone): Promise<ShippingZone> {
    const supabase = await getClient();
    const payload = newInputToDb(input);
    const { data, error } = await supabase
      .from("shipping_zones")
      .insert(payload as never)
      .select("*")
      .single();

    if (error) {
      throw new Error(`SupabaseShippingZoneRepo.create: ${error.message}`);
    }
    return mapRow(data as unknown as ShippingZoneDbRow);
  }

  async update(
    id: string,
    patch: Partial<NewShippingZone>,
  ): Promise<ShippingZone> {
    const supabase = await getClient();
    const payload = patchToDb(patch);
    const { data, error } = await supabase
      .from("shipping_zones")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`SupabaseShippingZoneRepo.update: ${error.message}`);
    }
    if (!data) throw new Error(`ShippingZone not found: ${id}`);
    return mapRow(data as unknown as ShippingZoneDbRow);
  }

  async archive(id: string): Promise<void> {
    const supabase = await getClient();
    const { error } = await supabase
      .from("shipping_zones")
      .update({ is_active: false } as never)
      .eq("id", id);

    if (error) {
      throw new Error(`SupabaseShippingZoneRepo.archive: ${error.message}`);
    }
  }
}
