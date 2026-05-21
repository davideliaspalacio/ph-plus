/**
 * API pública del design system.
 *
 * Importar desde cualquier feature como:
 *   import { Button, Input, Drawer } from "@/src/shared/ui";
 */

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button";
export { Input, type InputProps } from "./Input";
export { Select, type SelectProps, type SelectOption } from "./Select";
export { Badge, type BadgeTone } from "./Badge";
export { Drawer, type DrawerProps, type DrawerSide } from "./Drawer";
export { Modal, type ModalProps } from "./Modal";
export { Tabs, type TabsProps, type TabItem } from "./Tabs";
export { EmptyState, type EmptyStateProps } from "./EmptyState";
export { Skeleton, type SkeletonProps } from "./Skeleton";
export { Pagination, type PaginationProps } from "./Pagination";
export {
  ToastProvider,
  useToast,
  __resetToastsForTests,
  type ToastTone,
  type ToastItem,
} from "./Toast";
