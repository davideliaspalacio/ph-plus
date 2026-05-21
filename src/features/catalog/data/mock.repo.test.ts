import { describe, expect, it } from "vitest";
import { MockProductRepo } from "./mock.repo";

describe("MockProductRepo", () => {
  it("list devuelve productos desde el seed (PRODUCTS de app/lib/products)", async () => {
    const repo = new MockProductRepo({ latency: 0 });
    const r = await repo.list();
    expect(r.items.length).toBeGreaterThan(0);
    expect(r.total).toBe(r.items.length);
    expect(r.page).toBe(1);
  });

  it("aplica filtros y sort", async () => {
    const repo = new MockProductRepo({ latency: 0 });
    const r = await repo.list({
      filters: { category: "garrafa" },
      sort: "price-asc",
    });
    expect(r.items.every((p) => p.category === "garrafa")).toBe(true);
    for (let i = 1; i < r.items.length; i++) {
      expect(r.items[i].priceValue).toBeGreaterThanOrEqual(
        r.items[i - 1].priceValue,
      );
    }
  });

  it("paginación funciona", async () => {
    const repo = new MockProductRepo({ latency: 0 });
    const total = (await repo.list()).total;
    const page1 = await repo.list({ page: 1, perPage: 3 });
    const page2 = await repo.list({ page: 2, perPage: 3 });
    expect(page1.items).toHaveLength(Math.min(3, total));
    expect(page1.totalPages).toBe(Math.ceil(total / 3));
    if (total > 3) {
      expect(page2.items[0].slug).not.toBe(page1.items[0].slug);
    }
  });

  it("bySlug devuelve el producto correcto o null", async () => {
    const repo = new MockProductRepo({ latency: 0 });
    const all = await repo.list();
    const first = all.items[0];
    expect((await repo.bySlug(first.slug))?.slug).toBe(first.slug);
    expect(await repo.bySlug("xxx-no-existe")).toBeNull();
  });

  it("search hace match por título substring", async () => {
    const repo = new MockProductRepo({ latency: 0 });
    const r = await repo.search("agua");
    expect(r.length).toBeGreaterThan(0);
    expect(
      r.every((p) =>
        p.title.toLowerCase().normalize("NFD").includes("agua"),
      ),
    ).toBe(true);
  });
});
