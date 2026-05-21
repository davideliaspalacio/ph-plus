"use client";

/**
 * Shim de compatibilidad.
 *
 * El estado real del carrito vive ahora en `@/src/features/cart/store/useCart`
 * (Zustand persistido). Este archivo conserva la API que ya usaban las páginas
 * existentes (`useCart()` con `{ items, hydrated, totalItems, addItem,
 * setQuantity, removeItem, clear }`) para no romper consumers durante el
 * Sprint 0. Las nuevas features deben importar directo desde
 * `@/src/features/cart`.
 */

import { useSyncExternalStore } from "react";
import {
  useCart as useCartStore,
  type CartItem,
} from "@/src/features/cart/store/useCart";

export type { CartItem };

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  totalItems: number;
  addItem: (slug: string, qty?: number) => void;
  setQuantity: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

// useSyncExternalStore con server-snapshot=false / client-snapshot=true
// es el patrón idiomático de React 19 para "isClient" sin disparar el
// lint react-hooks/set-state-in-effect.
const subscribeNoop = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Antes hidratábamos a mano. Ahora el middleware persist de Zustand se
  // encarga; el provider queda como pass-through para no tocar el layout.
  return <>{children}</>;
}

export function useCart(): CartContextValue {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return { items, hydrated, totalItems, addItem, setQuantity, removeItem, clear };
}
