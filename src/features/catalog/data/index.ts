import { MockProductRepo } from "./mock.repo";
import type { ProductRepository } from "./ports";
import type { Product } from "@/app/lib/products";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

// El día de Supabase: importar SupabaseProductRepo y switchear acá.
export const productRepo: ProductRepository<Product> =
  backend === "supabase"
    ? /* new SupabaseProductRepo() */ new MockProductRepo()
    : new MockProductRepo();
