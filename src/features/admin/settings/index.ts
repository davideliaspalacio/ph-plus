/**
 * API pública de la feature `admin/settings`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  SettingsSchema,
  StorePoliciesSchema,
  type Settings,
  type SettingsPatch,
  type StorePolicies,
} from "./domain/settings";

export {
  settingsRepo,
  MockSettingsRepo,
  SETTINGS_STORAGE_KEY,
  type SettingsRepository,
} from "./data";

export { SettingsForm, type SettingsFormProps } from "./ui/SettingsForm";
export {
  EmailOutboxViewer,
  type EmailOutboxViewerProps,
} from "./ui/EmailOutboxViewer";
