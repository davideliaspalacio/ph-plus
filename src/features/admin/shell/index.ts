/**
 * API pública de la feature `admin/shell`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export { AdminShell, type AdminShellProps } from "./ui/AdminShell";
export {
  AdminNav,
  ADMIN_NAV_ITEMS,
  type AdminNavItem,
  type AdminNavProps,
} from "./ui/AdminNav";
export { RequireAdmin, type RequireAdminProps } from "./ui/RequireAdmin";
