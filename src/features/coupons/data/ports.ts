import type { Coupon } from "../domain/coupon";

/**
 * Puerto del repositorio de cupones.
 *
 * El día que migremos a Supabase, una nueva implementación de esta interfaz
 * (SupabaseCouponRepo) reemplaza al mock sin tocar dominio ni UI.
 */

export type NewCouponInput = Omit<Coupon, "id" | "usedCount">;

export interface CouponRepository {
  findByCode(code: string): Promise<Coupon | null>;
  list(): Promise<Coupon[]>;
  create(input: NewCouponInput): Promise<Coupon>;
  update(id: string, patch: Partial<Coupon>): Promise<Coupon>;
  archive(id: string): Promise<void>;
  incrementUsage(id: string): Promise<Coupon>;
}
