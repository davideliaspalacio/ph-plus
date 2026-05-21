import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { PRODUCTS, type Product } from "@/app/lib/products";
import type { AdminProductRepository } from "./ports";

/**
 * Implementación mock del AdminProductRepository.
 *
 * Persiste productos editados/creados por el admin en `localStorage` bajo
 * `phplus.db.products.admin.v1`. El método `list()` mergea estos custom con
 * los seeds de `app/lib/products.ts`: los custom prevalecen por slug.
 *
 * Esto permite:
 * - "Editar" un seed sin tener que duplicarlo: el patch se guarda en la DB
 *   mock y al hacer list() pisa el seed original.
 * - "Crear" productos nuevos que no existen como seed.
 * - "Archivar" un seed: se guarda un override con `inStock = false`.
 */

export const ADMIN_PRODUCTS_NAMESPACE = "phplus.db.products.admin.v1";

const ns = makeNamespacedStorage<Product>(ADMIN_PRODUCTS_NAMESPACE);

function mergeWithSeeds(custom: Product[]): Product[] {
  const overrides = new Map(custom.map((p) => [p.slug, p]));
  const merged: Product[] = [];
  const seen = new Set<string>();
  for (const seed of PRODUCTS) {
    const override = overrides.get(seed.slug);
    merged.push(override ?? seed);
    seen.add(seed.slug);
  }
  for (const p of custom) {
    if (!seen.has(p.slug)) merged.push(p);
  }
  return merged;
}

export class MockAdminProductRepo implements AdminProductRepository {
  async list(): Promise<Product[]> {
    return mergeWithSeeds(ns.list());
  }

  async byId(slug: string): Promise<Product | null> {
    const all = await this.list();
    return all.find((p) => p.slug === slug) ?? null;
  }

  async create(input: Product): Promise<Product> {
    const existing = await this.byId(input.slug);
    if (existing) {
      throw new Error(`Product slug "${input.slug}" already exists`);
    }
    ns.set(input.slug, input);
    return input;
  }

  async update(slug: string, patch: Partial<Product>): Promise<Product> {
    const current = await this.byId(slug);
    if (!current) throw new Error(`Product "${slug}" not found`);
    const next: Product = { ...current, ...patch, slug };
    ns.set(slug, next);
    return next;
  }

  async archive(slug: string): Promise<Product> {
    return this.update(slug, { inStock: false });
  }

  async bulkUpdate(
    slugs: string[],
    patch: Partial<Product>,
  ): Promise<Product[]> {
    const out: Product[] = [];
    for (const slug of slugs) {
      out.push(await this.update(slug, patch));
    }
    return out;
  }
}
