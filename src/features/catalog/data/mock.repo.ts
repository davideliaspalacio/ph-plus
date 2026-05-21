import { PRODUCTS as SEED, type Product } from "@/app/lib/products";
import { fakeLatency, sleep } from "@/src/shared/lib/async";
import { applyFilters, applySort } from "../domain/filters";
import type {
  ProductListInput,
  ProductListResult,
  ProductRepository,
} from "./ports";

/**
 * Repo de productos basado en el SEED estático.
 *
 * Para esta primera versión NO escribimos a localStorage: el catálogo es de
 * sólo lectura del lado usuario. Cuando entremos a admin CRUD vamos a switchear
 * el repo a uno que persista en `phplus.db.products.v1` y haga merges con el
 * seed. La interfaz no cambia.
 */
export class MockProductRepo implements ProductRepository<Product> {
  private latency: number | null;
  constructor(opts: { latency?: number | null } = {}) {
    this.latency = opts.latency ?? null; // null = aleatorio, 0 = sin delay
  }

  private async simulate() {
    if (this.latency === 0) return;
    if (this.latency == null) await fakeLatency();
    else await sleep(this.latency);
  }

  private all(): Product[] {
    return SEED;
  }

  async list(input: ProductListInput = {}): Promise<ProductListResult<Product>> {
    await this.simulate();
    const filtered = applyFilters(this.all(), input.filters ?? {});
    const sorted = applySort(filtered, input.sort);

    const perPage = input.perPage ?? sorted.length;
    const page = Math.max(1, input.page ?? 1);
    const start = (page - 1) * perPage;
    const items = sorted.slice(start, start + perPage);

    return {
      items,
      total: sorted.length,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(sorted.length / perPage)),
    };
  }

  async bySlug(slug: string): Promise<Product | null> {
    await this.simulate();
    return this.all().find((p) => p.slug === slug) ?? null;
  }

  async search(q: string): Promise<Product[]> {
    await this.simulate();
    return applyFilters(this.all(), { q });
  }
}
