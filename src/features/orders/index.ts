/**
 * API pública de la feature `orders`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  OrderSchema,
  OrderStatusSchema,
  OrderLineSchema,
  OrderTotalsSchema,
  OrderContactSchema,
  OrderShippingSchema,
  OrderPaymentSchema,
  OrderPaymentMethodSchema,
  OrderInternalNoteSchema,
  type Order,
  type OrderStatus,
  type OrderLine,
  type OrderTotals,
  type OrderContact,
  type OrderShipping,
  type OrderPayment,
  type OrderPaymentMethod,
  type OrderInternalNote,
} from "./domain/order";

export {
  ORDER_STATUS_FLOW,
  ORDER_STATUSES,
  isValidTransition,
} from "./domain/status";

export { orderRepo } from "./data";

export type {
  OrderRepository,
  OrderFilters,
  NewOrderInput,
  AddNoteInput,
} from "./data/ports";
