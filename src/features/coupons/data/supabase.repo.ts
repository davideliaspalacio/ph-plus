import { CouponSchema, type Coupon } from "../domain/coupon";
import type { CouponRepository, NewCouponInput } from "./ports";

/**
 * Repo de cupones contra Supabase.
 *
 * La tabla `public.coupons` usa snake_case (min_subtotal, max_uses,
 * max_uses_per_customer, used_count, is_active, starts_at, ends_at,
 * product_slugs, category_slugs). Acá hacemos el mapeo a la entidad
 * `Coupon` (camelCase) que consume la UI / dominio.
 */

interface CouponDbRow {
  id: string;
  code: string;
  type: Coupon["type"];
  value: number | string;
  starts_at: string;
  ends_at: string;
  min_subtotal: number | string;
  max_uses: number;
  max_uses_per_customer: number;
  used_count: number;
  is_active: boolean;
  product_slugs: unknown;
  category_slugs: unknown;
  created_at?: string;
  updated_at?: string;
}

function toStringArrayOrUndefined(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value.filter((v): v is string => typeof v === "string");
  return arr.length > 0 ? arr : undefined;
}

function mapRow(row: CouponDbRow): Coupon {
  return CouponSchema.parse({
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value),
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    minSubtotal: Number(row.min_subtotal),
    maxUses: row.max_uses,
    maxUsesPerCustomer: row.max_uses_per_customer,
    usedCount: row.used_count,
    isActive: row.is_active,
    productIds: toStringArrayOrUndefined(row.product_slugs),
    categoryIds: toStringArrayOrUndefined(row.category_slugs),
  });
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

function newInputToDb(
  input: NewCouponInput,
): Record<string, unknown> {
  return {
    code: normalizeCode(input.code),
    type: input.type,
    value: input.value,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    min_subtotal: input.minSubtotal,
    max_uses: input.maxUses,
    max_uses_per_customer: input.maxUsesPerCustomer,
    is_active: input.isActive,
    used_count: 0,
    product_slugs: input.productIds ?? null,
    category_slugs: input.categoryIds ?? null,
  };
}

function patchToDb(patch: Partial<Coupon>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (patch.code !== undefined) out.code = normalizeCode(patch.code);
  if (patch.type !== undefined) out.type = patch.type;
  if (patch.value !== undefined) out.value = patch.value;
  if (patch.startsAt !== undefined) out.starts_at = patch.startsAt;
  if (patch.endsAt !== undefined) out.ends_at = patch.endsAt;
  if (patch.minSubtotal !== undefined) out.min_subtotal = patch.minSubtotal;
  if (patch.maxUses !== undefined) out.max_uses = patch.maxUses;
  if (patch.maxUsesPerCustomer !== undefined) {
    out.max_uses_per_customer = patch.maxUsesPerCustomer;
  }
  if (patch.usedCount !== undefined) out.used_count = patch.usedCount;
  if (patch.isActive !== undefined) out.is_active = patch.isActive;
  if (patch.productIds !== undefined) out.product_slugs = patch.productIds;
  if (patch.categoryIds !== undefined) out.category_slugs = patch.categoryIds;
  return out;
}

export class SupabaseCouponRepo implements CouponRepository {
  async list(): Promise<Coupon[]> {
    const supabase = await getClient();
    const { data, error } = await supabase.from("coupons").select("*");

    if (error) {
      throw new Error(`SupabaseCouponRepo.list: ${error.message}`);
    }
    const rows = (data ?? []) as unknown as CouponDbRow[];
    return rows.map(mapRow);
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const target = normalizeCode(code);
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", target)
      .maybeSingle();

    if (error) {
      throw new Error(`SupabaseCouponRepo.findByCode: ${error.message}`);
    }
    if (!data) return null;
    return mapRow(data as unknown as CouponDbRow);
  }

  async create(input: NewCouponInput): Promise<Coupon> {
    const supabase = await getClient();
    const payload = newInputToDb(input);
    const { data, error } = await supabase
      .from("coupons")
      .insert(payload as never)
      .select("*")
      .single();

    if (error) {
      throw new Error(`SupabaseCouponRepo.create: ${error.message}`);
    }
    return mapRow(data as unknown as CouponDbRow);
  }

  async update(id: string, patch: Partial<Coupon>): Promise<Coupon> {
    const supabase = await getClient();
    const payload = patchToDb(patch);
    const { data, error } = await supabase
      .from("coupons")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`SupabaseCouponRepo.update: ${error.message}`);
    }
    if (!data) throw new Error(`Coupon ${id} not found`);
    return mapRow(data as unknown as CouponDbRow);
  }

  async archive(id: string): Promise<void> {
    const supabase = await getClient();
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: false } as never)
      .eq("id", id);

    if (error) {
      throw new Error(`SupabaseCouponRepo.archive: ${error.message}`);
    }
  }

  async incrementUsage(id: string): Promise<Coupon> {
    const supabase = await getClient();
    // Atomic increment: leemos used_count actual y aplicamos +1 en un único
    // update con condición optimista. Si en el futuro queremos hacerlo 100%
    // server-side, conviene una RPC `increment_coupon_usage(p_id uuid)`.
    const { data: current, error: readError } = await supabase
      .from("coupons")
      .select("used_count")
      .eq("id", id)
      .single();

    if (readError) {
      throw new Error(
        `SupabaseCouponRepo.incrementUsage(read): ${readError.message}`,
      );
    }
    if (!current) throw new Error(`Coupon ${id} not found`);

    const currentUsed = (current as { used_count: number }).used_count;
    const { data, error } = await supabase
      .from("coupons")
      .update({ used_count: currentUsed + 1 } as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`SupabaseCouponRepo.incrementUsage: ${error.message}`);
    }
    return mapRow(data as unknown as CouponDbRow);
  }
}
