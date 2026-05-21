import { describe, expect, it } from "vitest";
import { rankProducts } from "./ranking";
import type { ProductLike } from "@/src/features/catalog";

/**
 * Helper para fabricar productos de test sin pelearse con los campos
 * del dominio canónico (ProductCore).
 */
function p(over: Partial<ProductLike> & { slug: string; title: string }): ProductLike {
  return {
    shortTitle: over.shortTitle ?? over.title,
    priceValue: over.priceValue ?? 1000,
    category: (over.category as ProductLike["category"]) ?? "botellon",
    size: (over.size as ProductLike["size"]) ?? "1L",
    popularity: over.popularity ?? 0,
    tagline: over.tagline ?? "tagline genérico",
    visualKey: (over.visualKey as ProductLike["visualKey"]) ?? "garrafas",
    ...over,
  };
}

describe("rankProducts", () => {
  it("devuelve [] si la query está vacía", () => {
    const items = [p({ slug: "a", title: "Agua mineral" })];
    expect(rankProducts(items, "")).toEqual([]);
    expect(rankProducts(items, "   ")).toEqual([]);
  });

  it("devuelve [] si ningún producto matchea", () => {
    const items = [
      p({ slug: "a", title: "Agua mineral", tagline: "pura" }),
      p({ slug: "b", title: "Botellón gigante", tagline: "20 litros" }),
    ];
    expect(rankProducts(items, "vino")).toEqual([]);
  });

  it("prioriza match exacto sobre starts-with sobre includes", () => {
    const exact = p({ slug: "exact", title: "agua" });
    const starts = p({ slug: "starts", title: "agua mineral premium" });
    const includes = p({ slug: "inc", title: "Botellón con agua" });
    const onlyTagline = p({
      slug: "tag",
      title: "Producto X",
      tagline: "tiene agua",
    });
    const ranked = rankProducts([includes, starts, onlyTagline, exact], "agua");
    expect(ranked.map((r) => r.product.slug)).toEqual([
      "exact",
      "starts",
      "inc",
      "tag",
    ]);
  });

  it("starts-with es más fuerte que includes en title", () => {
    const starts = p({ slug: "s", title: "Agua mineral" });
    const includes = p({ slug: "i", title: "Refresco con agua" });
    const ranked = rankProducts([includes, starts], "agua");
    expect(ranked[0]?.product.slug).toBe("s");
    expect(ranked[1]?.product.slug).toBe("i");
  });

  it("es case-insensitive", () => {
    const items = [p({ slug: "a", title: "Agua Mineral" })];
    const ranked = rankProducts(items, "AGUA");
    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.product.slug).toBe("a");
  });

  it("es accent-insensitive", () => {
    const items = [
      p({ slug: "a", title: "Botellón gigante" }),
      p({ slug: "b", title: "Garrafa pequeña" }),
    ];
    const ranked = rankProducts(items, "botellon");
    expect(ranked.map((r) => r.product.slug)).toContain("a");

    const ranked2 = rankProducts(items, "pequena");
    expect(ranked2.map((r) => r.product.slug)).toContain("b");
  });

  it("matchea por tagline cuando no hay match en title", () => {
    const items = [
      p({ slug: "x", title: "Producto X", tagline: "agua premium" }),
    ];
    const ranked = rankProducts(items, "agua");
    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.score).toBeGreaterThan(0);
  });

  it("respeta el top N (default razonable)", () => {
    const items = Array.from({ length: 20 }, (_, i) =>
      p({ slug: `s-${i}`, title: `agua variante ${i}` }),
    );
    const top5 = rankProducts(items, "agua", 5);
    expect(top5).toHaveLength(5);
  });

  it("score: exact = 5, starts-with = 3, includes = 2, tagline = 1", () => {
    const exact = p({ slug: "e", title: "agua" });
    const starts = p({ slug: "s", title: "agua mineral" });
    const includes = p({ slug: "i", title: "Refresco agua natural" });
    const tagline = p({
      slug: "t",
      title: "Producto X",
      tagline: "contiene agua",
    });
    const ranked = rankProducts([exact, starts, includes, tagline], "agua", 10);
    const bySlug = Object.fromEntries(
      ranked.map((r) => [r.product.slug, r.score]),
    );
    expect(bySlug["e"]).toBe(5);
    expect(bySlug["s"]).toBe(3);
    expect(bySlug["i"]).toBe(2);
    expect(bySlug["t"]).toBe(1);
  });
});
