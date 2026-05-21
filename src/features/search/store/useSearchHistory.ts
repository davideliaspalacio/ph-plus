"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addRecent } from "../domain/recent";

export const SEARCH_HISTORY_STORAGE_KEY = "phplus.search.recent.v1";
const MAX_ITEMS = 5;

export type SearchHistoryState = {
  items: string[];
  add: (q: string) => void;
  remove: (q: string) => void;
  clear: () => void;
};

/**
 * Store del historial de búsquedas recientes.
 *
 * Persistido en `localStorage` con la llave `phplus.search.recent.v1`.
 * La lógica de dedupe + cap vive en `domain/recent` (pura, testeable sin el store).
 */
export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (q) => {
        const next = addRecent(get().items, q, MAX_ITEMS);
        if (next === get().items) return;
        set({ items: next });
      },

      remove: (q) =>
        set((state) => ({
          items: state.items.filter((item) => item !== q),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: SEARCH_HISTORY_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
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
