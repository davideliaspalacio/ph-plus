"use client";

import { create } from "zustand";
import type { ProductFilters, ProductSort } from "../domain/filters";

export interface CatalogState {
  filters: ProductFilters;
  sort: ProductSort;
  page: number;
  perPage: number;
  setFilter: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => void;
  setFilters: (next: ProductFilters) => void;
  setSort: (sort: ProductSort) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const INITIAL: Pick<CatalogState, "filters" | "sort" | "page" | "perPage"> = {
  filters: {},
  sort: "popular",
  page: 1,
  perPage: 12,
};

export const useCatalogStore = create<CatalogState>((set) => ({
  ...INITIAL,
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value }, page: 1 })),
  setFilters: (next) => set({ filters: next, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set(INITIAL),
}));
