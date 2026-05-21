import { ReviewSchema, type Review, type ReviewStatus } from "../domain/review";
import {
  REVIEW_ERRORS,
  type NewReviewInput,
  type ReviewRepository,
} from "./ports";

/**
 * Repo de reviews contra Supabase.
 *
 * La tabla `public.reviews` usa snake_case (product_slug, user_id,
 * author_name, rejection_reason, admin_response, created_at, updated_at)
 * mientras que el `Review` de dominio (camelCase) es lo que consume la UI.
 *
 * Errores → tiramos `new Error(REVIEW_ERRORS.NOT_FOUND)` o
 * `new Error("...")` para mantenernos compatibles con el mock.
 */

interface ReviewDbRow {
  id: string;
  product_slug: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  title: string;
  text: string;
  photo: string | null;
  recommends: boolean;
  status: ReviewStatus;
  rejection_reason: string | null;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewDbInsert {
  product_slug: string;
  user_id?: string | null;
  author_name: string;
  rating: number;
  title: string;
  text: string;
  photo?: string | null;
  recommends: boolean;
  status: ReviewStatus;
  rejection_reason?: string | null;
  admin_response?: string | null;
}

interface ReviewDbUpdate {
  status?: ReviewStatus;
  rejection_reason?: string | null;
  admin_response?: string | null;
}

function mapRow(row: ReviewDbRow): Review {
  return ReviewSchema.parse({
    id: row.id,
    productSlug: row.product_slug,
    userId: row.user_id ?? undefined,
    authorName: row.author_name,
    rating: row.rating,
    title: row.title,
    text: row.text,
    photo: row.photo ?? undefined,
    recommends: row.recommends,
    status: row.status,
    rejectionReason: row.rejection_reason ?? undefined,
    adminResponse: row.admin_response ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapInputToInsert(input: NewReviewInput): ReviewDbInsert {
  return {
    product_slug: input.productSlug,
    user_id: input.userId ?? null,
    author_name: input.authorName,
    rating: input.rating,
    title: input.title,
    text: input.text,
    photo: input.photo ?? null,
    recommends: input.recommends,
    status: input.status ?? "pending",
  };
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

function notFound(): Error {
  return new Error(REVIEW_ERRORS.NOT_FOUND);
}

export class SupabaseReviewRepo implements ReviewRepository {
  async create(input: NewReviewInput): Promise<Review> {
    const supabase = await getClient();
    const insertRow = mapInputToInsert(input);
    const { data, error } = await supabase
      .from("reviews")
      // Cast: el `Database` skeleton declara la tabla con keys camelCase;
      // la real es snake_case. Vamos por unknown para no usar `any`.
      .insert(insertRow as unknown as never)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        `SupabaseReviewRepo.create: ${error?.message ?? "no data"}`,
      );
    }
    return mapRow(data as unknown as ReviewDbRow);
  }

  async listByProduct(
    slug: string,
    status?: ReviewStatus,
  ): Promise<Review[]> {
    const supabase = await getClient();
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("product_slug", slug)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`SupabaseReviewRepo.listByProduct: ${error.message}`);
    }
    const rows = (data ?? []) as unknown as ReviewDbRow[];
    return rows.map(mapRow);
  }

  async listForModeration(
    status: ReviewStatus = "pending",
  ): Promise<Review[]> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `SupabaseReviewRepo.listForModeration: ${error.message}`,
      );
    }
    const rows = (data ?? []) as unknown as ReviewDbRow[];
    return rows.map(mapRow);
  }

  async approve(id: string): Promise<Review> {
    return this.updateReview(id, {
      status: "approved",
      rejection_reason: null,
    });
  }

  async reject(id: string, reason: string): Promise<Review> {
    return this.updateReview(id, {
      status: "rejected",
      rejection_reason: reason,
    });
  }

  async respond(id: string, text: string): Promise<Review> {
    return this.updateReview(id, { admin_response: text });
  }

  private async updateReview(
    id: string,
    patch: ReviewDbUpdate,
  ): Promise<Review> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("reviews")
      .update(patch as unknown as never)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`SupabaseReviewRepo.update: ${error.message}`);
    }
    if (!data) throw notFound();
    return mapRow(data as unknown as ReviewDbRow);
  }
}
