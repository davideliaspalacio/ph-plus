/**
 * API pública de la feature `admin/customers`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  VIP_THRESHOLD_COP,
  type CustomerView,
} from "./domain/customer-view";
export { buildCustomerView } from "./domain/compute";

export { customerAdminRepo } from "./data";
export type { CustomerAdminRepository } from "./data/ports";

export {
  CustomersTable,
  type CustomersTableProps,
} from "./ui/CustomersTable";
export {
  CustomerDetail,
  type CustomerDetailProps,
} from "./ui/CustomerDetail";
