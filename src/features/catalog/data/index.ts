import { FallbackProductRepo } from "./fallback.repo";
import { MockProductRepo } from "./mock.repo";
import { SupabaseProductRepo } from "./supabase.repo";
import type { ProductRepository } from "./ports";
import type { Product } from "@/app/lib/products";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";
const mockProductRepo = new MockProductRepo();

export const productRepo: ProductRepository<Product> =
  backend === "supabase"
    ? new FallbackProductRepo(new SupabaseProductRepo(), mockProductRepo, {
        label: "SupabaseProductRepo",
      })
    : mockProductRepo;
