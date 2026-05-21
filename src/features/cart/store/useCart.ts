"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const CART_STORAGE_KEY = "phplus.cart.v1";

export type CartItem = {
  slug: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  addItem: (slug: string, qty?: number) => void;
  setQuantity: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  totalItems: () => number;
};

/**
 * Store del carrito. Hidratado desde localStorage por el middleware persist.
 * Mantiene compatibilidad con el shape `{ slug, quantity }` que ya usa el resto de la app.
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (slug, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === slug ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { slug, quantity: qty }] };
        }),

      setQuantity: (slug, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.slug !== slug) };
          }
          return {
            items: state.items.map((i) =>
              i.slug === slug ? { ...i, quantity: qty } : i,
            ),
          };
        }),

      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          // SSR: storage no-op
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    },
  ),
);
