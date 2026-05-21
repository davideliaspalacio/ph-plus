"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  add as addDomain,
  contains as containsDomain,
  count as countDomain,
  remove as removeDomain,
  toggle as toggleDomain,
  type WishlistItem,
} from "../domain/wishlist";

export const WISHLIST_STORAGE_KEY = "phplus.wishlist.v1";

export type WishlistState = {
  items: WishlistItem[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  clear: () => void;
  contains: (slug: string) => boolean;
  count: () => number;
};

/**
 * Store de wishlist. Hidratado desde localStorage por el middleware persist.
 * Las acciones delegan en las reglas puras de `domain/wishlist` para mantener
 * un único lugar donde vive la lógica.
 */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (slug) =>
        set((state) => ({ items: addDomain(state.items, slug) })),

      remove: (slug) =>
        set((state) => ({ items: removeDomain(state.items, slug) })),

      toggle: (slug) =>
        set((state) => ({ items: toggleDomain(state.items, slug) })),

      clear: () => set({ items: [] }),

      contains: (slug) => containsDomain(get().items, slug),

      count: () => countDomain(get().items),
    }),
    {
      name: WISHLIST_STORAGE_KEY,
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
