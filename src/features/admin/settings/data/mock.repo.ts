import { storage } from "@/src/shared/lib/storage";
import { SETTINGS_SEED } from "@/src/mocks/settings.seed";
import { SettingsSchema, type Settings, type SettingsPatch } from "../domain/settings";
import type { SettingsRepository } from "./ports";

/**
 * Implementación mock del SettingsRepository.
 *
 * Persiste un único documento JSON en `localStorage` bajo la llave
 * `phplus.db.settings.v1`. Si la llave no existe, lo inicializa con
 * `SETTINGS_SEED` (definido en `src/mocks/settings.seed.ts`).
 */

export const SETTINGS_STORAGE_KEY = "phplus.db.settings.v1";

function seedToSettings(): Settings {
  // SETTINGS_SEED no trae `address`; el resto del shape coincide.
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

export class MockSettingsRepo implements SettingsRepository {
  async get(): Promise<Settings> {
    const raw = storage.get<unknown>(SETTINGS_STORAGE_KEY);
    if (raw == null) {
      const seeded = seedToSettings();
      storage.set(SETTINGS_STORAGE_KEY, seeded);
      return seeded;
    }
    const parsed = SettingsSchema.safeParse(raw);
    if (!parsed.success) {
      // Storage corrupta → re-seed.
      const seeded = seedToSettings();
      storage.set(SETTINGS_STORAGE_KEY, seeded);
      return seeded;
    }
    return parsed.data;
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
    storage.set(SETTINGS_STORAGE_KEY, merged);
    return merged;
  }
}
