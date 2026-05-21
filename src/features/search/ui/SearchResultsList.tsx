"use client";

import type { ProductLike } from "@/src/features/catalog";

export interface SearchResultsListProps {
  products: ProductLike[];
  onSelect: (product: ProductLike) => void;
  /**
   * Id del input asociado (para `aria-controls`/`aria-activedescendant` desde
   * el SearchBar). Si no se provee, se omite.
   */
  listboxId?: string;
  activeSlug?: string | null;
}

/**
 * Sub-componente puro que renderiza la lista de resultados de búsqueda.
 *
 * Es agnóstico del transporte: el SearchBar le pasa los productos ya
 * filtrados/rankeados y un handler `onSelect`.
 */
export function SearchResultsList({
  products,
  onSelect,
  listboxId,
  activeSlug,
}: SearchResultsListProps) {
  if (products.length === 0) {
    return (
      <div
        role="status"
        className="px-4 py-3 text-[13px] text-ink-muted"
      >
        Sin resultados
      </div>
    );
  }

  return (
    <ul
      id={listboxId}
      role="listbox"
      className="max-h-80 overflow-y-auto py-1"
    >
      {products.map((product) => {
        const isActive = activeSlug === product.slug;
        return (
          <li
            key={product.slug}
            id={`search-option-${product.slug}`}
            role="option"
            aria-selected={isActive}
            onMouseDown={(e) => {
              // mousedown en vez de click: evita que el input pierda foco antes
              // del select y dispare el cierre del dropdown.
              e.preventDefault();
              onSelect(product);
            }}
            onClick={() => onSelect(product)}
            className={
              "cursor-pointer px-4 py-2 text-[13px] transition " +
              (isActive
                ? "bg-brand/10 text-brand"
                : "text-ink hover:bg-card-border/30")
            }
          >
            <div className="font-semibold">{product.title}</div>
            {typeof product.tagline === "string" && product.tagline ? (
              <div className="text-[11px] text-ink-muted">
                {product.tagline}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
