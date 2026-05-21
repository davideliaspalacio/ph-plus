import { beforeEach, describe, expect, it } from "vitest";
import { useCatalogStore } from "./useCatalogStore";

beforeEach(() => {
  useCatalogStore.getState().reset();
});

describe("useCatalogStore", () => {
  it("estado inicial", () => {
    const s = useCatalogStore.getState();
    expect(s.filters).toEqual({});
    expect(s.sort).toBe("popular");
    expect(s.page).toBe(1);
    expect(s.perPage).toBe(12);
  });

  it("setFilter agrega/actualiza un filtro y resetea page", () => {
    useCatalogStore.getState().setPage(3);
    useCatalogStore.getState().setFilter("category", "garrafa");
    expect(useCatalogStore.getState().filters.category).toBe("garrafa");
    expect(useCatalogStore.getState().page).toBe(1);
  });

  it("setFilters reemplaza filtros completos y resetea page", () => {
    useCatalogStore.getState().setPage(2);
    useCatalogStore.getState().setFilters({ size: "19L" });
    expect(useCatalogStore.getState().filters).toEqual({ size: "19L" });
    expect(useCatalogStore.getState().page).toBe(1);
  });

  it("setSort cambia el sort y resetea page", () => {
    useCatalogStore.getState().setPage(4);
    useCatalogStore.getState().setSort("price-desc");
    expect(useCatalogStore.getState().sort).toBe("price-desc");
    expect(useCatalogStore.getState().page).toBe(1);
  });

  it("setPage cambia la página", () => {
    useCatalogStore.getState().setPage(7);
    expect(useCatalogStore.getState().page).toBe(7);
  });
});
