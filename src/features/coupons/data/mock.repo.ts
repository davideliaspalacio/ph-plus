import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import { CouponSchema, type Coupon } from "../domain/coupon";
import type { CouponRepository, NewCouponInput } from "./ports";

/**
 * Implementación mock del CouponRepository.
 *
 * Persiste en `localStorage` bajo el namespace `phplus.db.coupons.v1`. Si la
 * tabla está vacía, siembra 3 cupones iniciales así el storefront tiene algo
 * con qué jugar desde el primer load.
 */

export const COUPONS_NAMESPACE = "phplus.db.coupons.v1";

const ns = makeNamespacedStorage<Coupon>(COUPONS_NAMESPACE);

const SEED_INPUTS: NewCouponInput[] = [
  {
    code: "BIENVENIDA10",
    type: "percent",
    value: 10,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    minSubtotal: 0,
    maxUses: 1000,
    maxUsesPerCustomer: 1,
    isActive: true,
  },
  {
    code: "ENVIOGRATIS",
    type: "free_shipping",
    value: 0,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    minSubtotal: 0,
    maxUses: 1000,
    maxUsesPerCustomer: 5,
    isActive: true,
  },
  {
    code: "PHPLUS5K",
    type: "fixed",
    value: 5000,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    minSubtotal: 30_000,
    maxUses: 500,
    maxUsesPerCustomer: 1,
    isActive: true,
  },
];

function ensureSeeds(): void {
  if (ns.list().length > 0) return;
  for (const input of SEED_INPUTS) {
    const coupon = CouponSchema.parse({
      ...input,
      id: newId(),
      usedCount: 0,
    });
    ns.set(coupon.id, coupon);
  }
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

export class MockCouponRepo implements CouponRepository {
  async list(): Promise<Coupon[]> {
    ensureSeeds();
    return ns.list();
  }

  async findByCode(code: string): Promise<Coupon | null> {
    ensureSeeds();
    const target = normalizeCode(code);
    const found = ns.list().find((c) => c.code === target);
    return found ?? null;
  }

  async create(input: NewCouponInput): Promise<Coupon> {
    ensureSeeds();
    const coupon = CouponSchema.parse({
      ...input,
      id: newId(),
      usedCount: 0,
    });
    ns.set(coupon.id, coupon);
    return coupon;
  }

  async update(id: string, patch: Partial<Coupon>): Promise<Coupon> {
    const current = ns.get(id);
    if (!current) throw new Error(`Coupon ${id} not found`);
    const next = CouponSchema.parse({ ...current, ...patch, id });
    ns.set(id, next);
    return next;
  }

  async archive(id: string): Promise<void> {
    const current = ns.get(id);
    if (!current) throw new Error(`Coupon ${id} not found`);
    const next = CouponSchema.parse({ ...current, isActive: false });
    ns.set(id, next);
  }

  async incrementUsage(id: string): Promise<Coupon> {
    const current = ns.get(id);
    if (!current) throw new Error(`Coupon ${id} not found`);
    const next = CouponSchema.parse({
      ...current,
      usedCount: current.usedCount + 1,
    });
    ns.set(id, next);
    return next;
  }
}
