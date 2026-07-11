"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { productRepo, type ProductLike } from "@/src/features/catalog";
import { rankProducts } from "../domain/ranking";
import { useSearchHistory } from "../store/useSearchHistory";
import { SearchResultsList } from "./SearchResultsList";

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;
const TOP_N = 6;

export interface SearchBarProps {
  /**
   * Opcional: si se provee, se usa como fuente de productos en vez de
   * `productRepo`. Útil para tests y para escenarios donde la lista ya está
   * en memoria (p.ej. una página que la hidrata desde server).
   */
  products?: ProductLike[];
  /** Callback opcional cuando el usuario selecciona un resultado. */
  onSelect?: (product: ProductLike) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Input de búsqueda global con dropdown.
 *
 * - Debounce 200ms vía `useEffect + setTimeout`.
 * - Dropdown sólo si `query.length >= 2`.
 * - Escape cierra el dropdown.
 * - Click en resultado lleva al catálogo general y registra la query en el
 *   historial reciente. Las fichas de detalle no se exponen en el storefront.
 */
export function SearchBar({
  products,
  onSelect,
  placeholder = "Buscar productos…",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState<ProductLike[] | null>(null);

  const addRecent = useSearchHistory((s) => s.add);

  // Si nos pasaron products como prop, los usamos directamente.
  useEffect(() => {
    if (products) return;
    // Carga lazy del catálogo desde el repo.
    let cancelled = false;
    productRepo
      .list()
      .then((result) => {
        if (!cancelled) setFetched(result.items);
      })
      .catch(() => {
        if (!cancelled) setFetched([]);
      });
    return () => {
      cancelled = true;
    };
  }, [products]);

  // Debounce del input.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // Resultados rankeados.
  const results = useMemo(() => {
    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) return [];
    const availableProducts = products ?? fetched;
    if (!availableProducts) return [];
    return rankProducts(availableProducts, debouncedQuery, TOP_N).map(
      (r) => r.product,
    );
  }, [debouncedQuery, fetched, products]);

  // El dropdown está abierto cuando: el usuario escribió >= 2 chars,
  // hay un valor estable (debounced) >= 2, y la UI no lo cerró con Escape.
  const shouldShow =
    open &&
    debouncedQuery.trim().length >= MIN_QUERY_LENGTH &&
    query.trim().length >= MIN_QUERY_LENGTH;

  const handleSelect = (product: ProductLike) => {
    addRecent(query);
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    if (onSelect) onSelect(product);
    router.push("/productos");
  };

  // Cierra el dropdown si se hace click fuera.
  useEffect(() => {
    if (!shouldShow) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [shouldShow]);

  return (
    <div
      ref={containerRef}
      role="combobox"
      aria-controls={shouldShow ? listboxId : undefined}
      aria-expanded={shouldShow}
      aria-haspopup="listbox"
      className={"relative " + (className ?? "")}
    >
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <input
        type="search"
        role="searchbox"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length >= MIN_QUERY_LENGTH) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            e.currentTarget.blur();
          }
        }}
        placeholder={placeholder}
        aria-autocomplete="list"
        className="w-full rounded-full border border-card-border bg-white pl-10 pr-4 py-2 text-[14px] text-ink placeholder:text-ink-muted caret-brand outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:appearance-none"
      />

      {shouldShow ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-card-border bg-white text-ink shadow-lg">
          <SearchResultsList
            products={results}
            onSelect={handleSelect}
            listboxId={listboxId}
          />
        </div>
      ) : null}
    </div>
  );
}
