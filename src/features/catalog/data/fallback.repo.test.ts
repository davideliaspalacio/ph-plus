import { describe, expect, it, vi } from "vitest";
import type { ProductLike } from "../domain/product";
import type { ProductRepository } from "./ports";
import {
  FallbackProductRepo,
  isTransientCatalogFailure,
} from "./fallback.repo";

type TestProduct = ProductLike & { slug: string; title: string };

const fallbackProduct: TestProduct = {
  slug: "kit-inicial-botellon-19lts",
  title: "Kit inicial",
  shortTitle: "Kit inicial",
  priceValue: 85000,
  category: "kit",
  size: "19L",
  popularity: 95,
  tagline: "Fallback",
  visualKey: "kit",
};

function repo(
  overrides: Partial<ProductRepository<TestProduct>>,
): ProductRepository<TestProduct> {
  return {
    list: vi.fn(async () => ({
      items: [],
      total: 0,
      page: 1,
      perPage: 0,
      totalPages: 1,
    })),
    bySlug: vi.fn(async () => null),
    search: vi.fn(async () => []),
    ...overrides,
  };
}

describe("FallbackProductRepo", () => {
  it("usa el fallback cuando Supabase falla por fetch", async () => {
    const primary = repo({
      bySlug: vi.fn(async () => {
        throw new Error("SupabaseProductRepo.bySlug: TypeError: fetch failed");
      }),
    });
    const fallback = repo({
      bySlug: vi.fn(async () => fallbackProduct),
    });
    const warn = vi.fn();
    const subject = new FallbackProductRepo(primary, fallback, { warn });

    await expect(
      subject.bySlug("kit-inicial-botellon-19lts"),
    ).resolves.toEqual(fallbackProduct);
    expect(fallback.bySlug).toHaveBeenCalledWith("kit-inicial-botellon-19lts");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("no oculta errores que no parecen transitorios", async () => {
    const primary = repo({
      list: vi.fn(async () => {
        throw new Error("relation products does not exist");
      }),
    });
    const fallback = repo({
      list: vi.fn(async () => ({
        items: [fallbackProduct],
        total: 1,
        page: 1,
        perPage: 1,
        totalPages: 1,
      })),
    });
    const subject = new FallbackProductRepo(primary, fallback);

    await expect(subject.list()).rejects.toThrow(
      "relation products does not exist",
    );
    expect(fallback.list).not.toHaveBeenCalled();
  });
});

describe("isTransientCatalogFailure", () => {
  it("reconoce errores de red/fetch", () => {
    expect(isTransientCatalogFailure(new TypeError("fetch failed"))).toBe(true);
    expect(isTransientCatalogFailure(new Error("ENOTFOUND supabase.co"))).toBe(
      true,
    );
  });

  it("rechaza errores de esquema o permisos", () => {
    expect(isTransientCatalogFailure(new Error("permission denied"))).toBe(
      false,
    );
  });
});
