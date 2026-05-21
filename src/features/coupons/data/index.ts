import { MockCouponRepo } from "./mock.repo";
import type { CouponRepository } from "./ports";

/**
 * Singleton del repositorio de cupones. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * podrá enrutar a `SupabaseCouponRepo` cuando exista.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const couponRepo: CouponRepository =
  backend === "supabase" ? new MockCouponRepo() : new MockCouponRepo();
