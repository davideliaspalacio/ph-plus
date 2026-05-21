import { describe, expect, it } from "vitest";
import { applyFilters, applySort, type ProductFilters } from "./filters";
import type { ProductCore } from "./product";

const p = (over: Partial<ProductCore>): ProductCore => ({
  slug: "x",
  title: "X",
  shortTitle: "X",
  priceValue: 10_000,
  category: "garrafa",
  size: "1L",
  popularity: 1,
  inStock: true,
  tagline: "t",
  visualKey: "garrafas",
  ...over,
});

const list: ProductCore[] = [
  p({ slug: "a", title: "Agua Botellón 19L", category: "botellon", size: "19L", priceValue: 36_000, popularity: 10 }),
  p({ slug: "b", title: "Garrafa 5L", category: "garrafa", size: "5L", priceValue: 18_000, popularity: 5 }),
  p({ slug: "c", title: "Recarga 1L promo", category: "promocion", size: "1L", priceValue: 5_000, popularity: 3, prevPriceValue: 7_000 }),
  p({ slug: "d", title: "Kit dispensador", category: "kit", size: "kit", priceValue: 280_000, popularity: 7 }),
  p({ slug: "e", title: "Recarga botellón 19L", category: "recarga", size: "19L", priceValue: 22_000, popularity: 8, inStock: false }),
];

describe("applyFilters", () => {
  it("sin filtros devuelve toda la lista", () => {
    expect(applyFilters(list, {}).map((p) => p.slug)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
  });

  it("filtra por categoría", () => {
    expect(
      applyFilters(list, { category: "garrafa" }).map((p) => p.slug),
    ).toEqual(["b"]);
  });

  it("filtra por tamaño", () => {
    expect(applyFilters(list, { size: "19L" }).map((p) => p.slug)).toEqual([
      "a",
      "e",
    ]);
  });

  it("filtra por búsqueda (case-insensitive)", () => {
    expect(applyFilters(list, { q: "RECARGA" }).map((p) => p.slug)).toEqual([
      "c",
      "e",
    ]);
  });

  it("filtra por promoción (tiene prevPriceValue)", () => {
    expect(applyFilters(list, { promo: true }).map((p) => p.slug)).toEqual([
      "c",
    ]);
  });

  it("filtra por rango de precio", () => {
    expect(
      applyFilters(list, { minPrice: 10_000, maxPrice: 30_000 }).map(
        (p) => p.slug,
      ),
    ).toEqual(["b", "e"]);
  });

  it("filtra por disponibilidad", () => {
    expect(
      applyFilters(list, { onlyInStock: true }).map((p) => p.slug),
    ).toEqual(["a", "b", "c", "d"]);
  });

  it("combina filtros (categoría + búsqueda)", () => {
    expect(
      applyFilters(list, { category: "recarga", q: "botellón" }).map(
        (p) => p.slug,
      ),
    ).toEqual(["e"]);
  });

  it("búsqueda ignora acentos", () => {
    expect(applyFilters(list, { q: "botellon" }).map((p) => p.slug)).toEqual([
      "a",
      "e",
    ]);
  });
});

describe("applySort", () => {
  it("popular: desc por popularity", () => {
    expect(applySort(list, "popular").map((p) => p.slug)).toEqual([
      "a",
      "e",
      "d",
      "b",
      "c",
    ]);
  });

  it("price-asc: ascendente por precio", () => {
    expect(applySort(list, "price-asc").map((p) => p.slug)).toEqual([
      "c",
      "b",
      "e",
      "a",
      "d",
    ]);
  });

  it("price-desc: descendente por precio", () => {
    expect(applySort(list, "price-desc").map((p) => p.slug)).toEqual([
      "d",
      "a",
      "e",
      "b",
      "c",
    ]);
  });

  it("newest: aplica orden estable (preserva input si no hay campo de fecha)", () => {
    // sin createdAt en ProductCore, newest se comporta como identidad
    expect(applySort(list, "newest").map((p) => p.slug)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
  });

  it("sin sort devuelve la lista tal cual (estable)", () => {
    expect(applySort(list, undefined).map((p) => p.slug)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
  });
});
