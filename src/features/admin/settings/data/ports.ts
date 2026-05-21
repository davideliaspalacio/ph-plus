import type { Settings, SettingsPatch } from "../domain/settings";

/**
 * Puerto del repositorio de Settings.
 *
 * Misma estrategia que el resto de las features: la UI consume este contrato
 * y mañana una `SupabaseSettingsRepo` lo cumple sin tocar nada más.
 */
export interface SettingsRepository {
  /**
   * Devuelve la configuración actual. Si la storage está vacía, el repo
   * inicializa con el seed por defecto (`SETTINGS_SEED`).
   */
  get(): Promise<Settings>;
  /**
   * Aplica un patch parcial y devuelve la configuración actualizada.
   * El patch se mergea sobre los valores actuales y se valida con
   * `SettingsSchema` antes de persistir.
   */
  update(patch: SettingsPatch): Promise<Settings>;
}
