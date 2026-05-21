/**
 * API pública de la feature `admin/coupons-ui`.
 *
 * Componentes de admin para gestión de cupones. Reutiliza el dominio y los
 * tipos de la feature `coupons` (no duplica schemas).
 */

export { CouponsTable, type CouponsTableProps } from "./ui/CouponsTable";
export {
  CouponForm,
  type CouponFormProps,
  type CouponFormInput,
} from "./ui/CouponForm";
