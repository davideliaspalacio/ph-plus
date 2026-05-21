import { beforeEach, describe, expect, it } from "vitest";
import { MockAdminProductRepo, ADMIN_PRODUCTS_NAMESPACE } from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { PRODUCTS, type Product } from "@/app/lib/products";

const ns = makeNamespacedStorage<Product>(ADMIN_PRODUCTS_NAMESPACE);

const newProduct: Product = {
  slug: "producto-custom",
  visualKey: "garrafas",
  title: "Producto Custom",
  shortTitle: "Custom",
  price: "$10.000",
  priceValue: 10000,
  tagline: "Probando",
  description: "Descripción de prueba",
  longDescription: [],
  features: [],
  includes: [],
  category: "botellon",
  size: "1L",
  popularity: 10,
  inStock: true,
  gallery: [],
  specs: [],
  usage: [],
  reviews: [],
  rating: { average: 0, count: 0 },
};

beforeEach(() => {
  localStorage.clear();
  ns.clear();
});

describe("MockAdminProductRepo", () => {
  it("list() devuelve los seeds cuando la DB custom está vacía", async () => {
    const repo = new MockAdminProductRepo();
    const all = await repo.list();
    expect(all).toHaveLength(PRODUCTS.length);
    expect(all[0].slug).toBe(PRODUCTS[0].slug);
  });

  it("create() agrega un producto custom al final del list", async () => {
    const repo = new MockAdminProductRepo();
    await repo.create(newProduct);
    const all = await repo.list();
    expect(all).toHaveLength(PRODUCTS.length + 1);
    expect(all.find((p) => p.slug === newProduct.slug)).toBeDefined();
  });

  it("create() falla si el slug ya existe (collision con seed)", async () => {
    const repo = new MockAdminProductRepo();
    const seed = PRODUCTS[0];
    await expect(
      repo.create({ ...newProduct, slug: seed.slug }),
    ).rejects.toThrow(/already exists/);
  });

  it("update() de un seed crea un override que pisa al seed en list()", async () => {
    const repo = new MockAdminProductRepo();
    const seedSlug = PRODUCTS[0].slug;
    await repo.update(seedSlug, { popularity: 1 });
    const all = await repo.list();
    const overriden = all.find((p) => p.slug === seedSlug);
    expect(overriden?.popularity).toBe(1);
    expect(all).toHaveLength(PRODUCTS.length);
  });

  it("byId() encuentra seeds y customs", async () => {
    const repo = new MockAdminProductRepo();
    await repo.create(newProduct);
    expect((await repo.byId(PRODUCTS[0].slug))?.slug).toBe(PRODUCTS[0].slug);
    expect((await repo.byId(newProduct.slug))?.slug).toBe(newProduct.slug);
    expect(await repo.byId("inexistente-xyz")).toBeNull();
  });

  it("archive() marca inStock=false como override", async () => {
    const repo = new MockAdminProductRepo();
    const slug = PRODUCTS[0].slug;
    await repo.archive(slug);
    const reloaded = await repo.byId(slug);
    expect(reloaded?.inStock).toBe(false);
  });

  it("bulkUpdate() aplica el mismo patch a varios slugs", async () => {
    const repo = new MockAdminProductRepo();
    const slugs = [PRODUCTS[0].slug, PRODUCTS[1].slug];
    const result = await repo.bulkUpdate(slugs, { inStock: false });
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.inStock === false)).toBe(true);
    const all = await repo.list();
    for (const slug of slugs) {
      expect(all.find((p) => p.slug === slug)?.inStock).toBe(false);
    }
  });
});
