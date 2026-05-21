import { MockSettingsRepo } from "./mock.repo";
import type { SettingsRepository } from "./ports";

/**
 * Singleton del repositorio de Settings.
 *
 * El flag `NEXT_PUBLIC_DATA_BACKEND` podrá enrutar a `SupabaseSettingsRepo`
 * cuando exista. Por ahora ambos casos resuelven al mock.
 */
const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const settingsRepo: SettingsRepository =
  backend === "supabase" ? new MockSettingsRepo() : new MockSettingsRepo();

export { MockSettingsRepo, SETTINGS_STORAGE_KEY } from "./mock.repo";
export type { SettingsRepository } from "./ports";
