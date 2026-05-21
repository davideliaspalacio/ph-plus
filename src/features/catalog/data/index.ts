import { MockProductRepo } from "./mock.repo";
import { SupabaseProductRepo } from "./supabase.repo";
import type { ProductRepository } from "./ports";
import type { Product } from "@/app/lib/products";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const productRepo: ProductRepository<Product> =
  backend === "supabase" ? new SupabaseProductRepo() : new MockProductRepo();
