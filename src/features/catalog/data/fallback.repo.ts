import type { ProductLike } from "../domain/product";
import type {
  ProductListInput,
  ProductListResult,
  ProductRepository,
} from "./ports";

type FallbackOptions = {
  label?: string;
  shouldFallback?: (error: unknown) => boolean;
  warn?: (message: string, error: unknown) => void;
};

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

export function isTransientCatalogFailure(error: unknown): boolean {
  return /fetch failed|failed to fetch|networkerror|load failed|econnrefused|enotfound|etimedout|eai_again/i.test(
    errorText(error),
  );
}

function defaultWarn(message: string, error: unknown) {
  console.warn(message, error);
}

export class FallbackProductRepo<P extends ProductLike>
  implements ProductRepository<P>
{
  constructor(
    private readonly primary: ProductRepository<P>,
    private readonly fallback: ProductRepository<P>,
    private readonly options: FallbackOptions = {},
  ) {}

  private async run<T>(
    operation: string,
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      const shouldFallback =
        this.options.shouldFallback ?? isTransientCatalogFailure;

      if (!shouldFallback(error)) throw error;

      const label = this.options.label ?? "ProductRepo";
      const warn = this.options.warn ?? defaultWarn;
      warn(`${label}.${operation} failed; using catalog fallback.`, error);

      return fallback();
    }
  }

  list(input: ProductListInput = {}): Promise<ProductListResult<P>> {
    return this.run(
      "list",
      () => this.primary.list(input),
      () => this.fallback.list(input),
    );
  }

  bySlug(slug: string): Promise<P | null> {
    return this.run(
      "bySlug",
      () => this.primary.bySlug(slug),
      () => this.fallback.bySlug(slug),
    );
  }

  search(q: string): Promise<P[]> {
    return this.run(
      "search",
      () => this.primary.search(q),
      () => this.fallback.search(q),
    );
  }
}
