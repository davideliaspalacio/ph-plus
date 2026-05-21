import { MockSettingsRepo } from "./mock.repo";
import { SupabaseSettingsRepo } from "./supabase.repo";
import type { SettingsRepository } from "./ports";

/**
 * Singleton del repositorio de Settings.
 *
 * Switch por `NEXT_PUBLIC_DATA_BACKEND`:
 *  - "supabase" → `SupabaseSettingsRepo` (tabla `settings`, id='main')
 *  - cualquier otro → `MockSettingsRepo` (localStorage)
 */
const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const settingsRepo: SettingsRepository =
  backend === "supabase" ? new SupabaseSettingsRepo() : new MockSettingsRepo();

export { MockSettingsRepo, SETTINGS_STORAGE_KEY } from "./mock.repo";
export { SupabaseSettingsRepo } from "./supabase.repo";
export type { SettingsRepository } from "./ports";
