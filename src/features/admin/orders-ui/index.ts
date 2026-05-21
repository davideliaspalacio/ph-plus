/**
 * API pública de la feature `admin/orders-ui`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export { OrdersTable, statusLabel, statusTone, type OrdersTableProps } from "./ui/OrdersTable";
export { OrderDetail, type OrderDetailProps } from "./ui/OrderDetail";
export {
  OrderTimeline,
  type OrderTimelineProps,
  type OrderTimelineExtra,
} from "./ui/OrderTimeline";
export { OrderNotes, type OrderNotesProps } from "./ui/OrderNotes";
