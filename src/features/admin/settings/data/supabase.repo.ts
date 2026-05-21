import { SETTINGS_SEED } from "@/src/mocks/settings.seed";
import {
  SettingsSchema,
  type Settings,
  type SettingsPatch,
} from "../domain/settings";
import type { SettingsRepository } from "./ports";

/**
 * Implementación Supabase del SettingsRepository.
 *
 * Tabla `settings` con id='main' (single doc). snake↔camel mapping en el
 * `mapRow`: business_name → businessName, tax_rate → taxRate, payment_methods
 * → paymentMethods, etc.
 */

const SETTINGS_ID = "main";

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

type SettingsRow = {
  id: string;
  business_name: string;
  nit: string;
  phone: string;
  whatsapp: string;
  address: string | null;
  tax_rate: number;
  payment_methods: unknown;
  policies: unknown;
};

function seedToSettings(): Settings {
  return SettingsSchema.parse({
    businessName: SETTINGS_SEED.businessName,
    nit: SETTINGS_SEED.nit,
    phone: SETTINGS_SEED.phone,
    whatsapp: SETTINGS_SEED.whatsapp,
    taxRate: SETTINGS_SEED.taxRate,
    paymentMethods: [...SETTINGS_SEED.paymentMethods],
    policies: { ...SETTINGS_SEED.policies },
  });
}

function mapRow(row: SettingsRow): Settings {
  return SettingsSchema.parse({
    businessName: row.business_name,
    nit: row.nit,
    phone: row.phone,
    whatsapp: row.whatsapp,
    address: row.address ?? undefined,
    taxRate: Number(row.tax_rate),
    paymentMethods: Array.isArray(row.payment_methods)
      ? row.payment_methods
      : [],
    policies: row.policies,
  });
}

function toDbRow(s: Settings): Record<string, unknown> {
  return {
    business_name: s.businessName,
    nit: s.nit,
    phone: s.phone,
    whatsapp: s.whatsapp,
    address: s.address ?? null,
    tax_rate: s.taxRate,
    payment_methods: s.paymentMethods,
    policies: s.policies,
  };
}

export class SupabaseSettingsRepo implements SettingsRepository {
  async get(): Promise<Settings> {
    const client = await getClient();
    const { data, error } = await client
      .from("settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (error) throw new Error(`settings.get: ${error.message}`);
    if (data) return mapRow(data as unknown as SettingsRow);

    const seeded = seedToSettings();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("settings") as any;
    const { error: insertError } = await table.insert({
      id: SETTINGS_ID,
      ...toDbRow(seeded),
    });
    if (insertError) {
      return seeded;
    }
    return seeded;
  }

  async update(patch: SettingsPatch): Promise<Settings> {
    const current = await this.get();
    const merged: Settings = SettingsSchema.parse({
      ...current,
      ...patch,
      policies: {
        ...current.policies,
        ...(patch.policies ?? {}),
      },
      paymentMethods: patch.paymentMethods
        ? [...patch.paymentMethods]
        : current.paymentMethods,
    });

    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("settings") as any;
    const { data, error } = await table
      .update(toDbRow(merged))
      .eq("id", SETTINGS_ID)
      .select("*")
      .single();
    if (error) throw new Error(`settings.update: ${error.message}`);
    return mapRow(data as unknown as SettingsRow);
  }
}
