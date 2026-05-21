import { MockCouponRepo } from "./mock.repo";
import { SupabaseCouponRepo } from "./supabase.repo";
import type { CouponRepository } from "./ports";

/**
 * Singleton del repositorio de cupones. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * enruta a `SupabaseCouponRepo` cuando vale "supabase"; default `mock`.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const couponRepo: CouponRepository =
  backend === "supabase" ? new SupabaseCouponRepo() : new MockCouponRepo();
