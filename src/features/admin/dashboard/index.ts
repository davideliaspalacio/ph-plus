/**
 * API pública de la feature `admin/dashboard`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export { computeKpis, type Kpis, type TopProduct, type OrdersByStatus } from "./domain/kpis";
export { KpiCard, type KpiCardProps, type KpiCardTone } from "./ui/KpiCard";
export { DashboardOverview, type DashboardOverviewProps } from "./ui/DashboardOverview";
