"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductVisual from "../components/ProductVisual";
import AddToCartButton from "../components/AddToCartButton";
import Reveal from "../components/Reveal";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useMockLoading } from "../components/useMockLoading";
import {
  CATEGORY_LABEL,
  PRODUCTS,
  SIZE_LABEL,
  formatCOP,
  type Product,
  type ProductCategory,
  type ProductSize,
} from "../lib/products";

type SortKey = "relevance" | "price-asc" | "price-desc";

const CATEGORIES = Object.keys(CATEGORY_LABEL) as ProductCategory[];
const SIZES = Object.keys(SIZE_LABEL) as ProductSize[];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-ink-muted"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M3 6h18M6 12h12M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PillToggle({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors " +
        (active
          ? "border-brand bg-brand text-white"
          : "border-card-border bg-white text-ink hover:border-brand hover:text-brand")
      }
    >
      {children}
    </button>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-card-border py-4 last:border-b-0">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 60}>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-white transition-shadow hover:shadow-[0_10px_30px_rgba(27,34,166,0.10)]">
        <Link
          href={`/productos/${product.slug}`}
          className="grid h-44 w-full place-items-center bg-[#f4f6fb] sm:h-52"
          aria-label={`Ver detalles de ${product.title}`}
        >
          <ProductVisual
            visualKey={product.visualKey}
            className="h-36 w-auto transition-transform duration-300 hover:scale-105 sm:h-40"
          />
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#eef0ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
              {CATEGORY_LABEL[product.category]}
            </span>
            {product.highlight && (
              <span className="rounded-full bg-accent-cyan px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                Promo
              </span>
            )}
            <span className="rounded-full border border-card-border px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
              {SIZE_LABEL[product.size]}
            </span>
          </div>

          <Link
            href={`/productos/${product.slug}`}
            className="text-[14px] font-bold leading-tight text-brand hover:underline sm:text-[15px]"
          >
            {product.title}
          </Link>

          <p className="line-clamp-2 text-[12px] leading-[1.45] text-ink-muted sm:text-[13px]">
            {product.tagline}
          </p>

          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-[18px] font-extrabold text-brand sm:text-[20px]">
              {product.price}
            </span>
            {product.prevPrice && (
              <span className="text-[12px] text-ink-muted line-through">
                {product.prevPrice}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <AddToCartButton
              slug={product.slug}
              mode="add"
              variant="primary"
              label="Agregar al carrito"
              className="w-full !py-2 !text-[12px]"
            />
            <Link
              href={`/productos/${product.slug}`}
              className="text-center text-[12px] font-semibold text-brand underline-offset-2 hover:underline"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function ProductsListingPage() {
  const initialLoading = useMockLoading();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.tagline.toLowerCase().includes(q)) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }
      if (selectedSizes.length > 0 && !selectedSizes.includes(p.size)) {
        return false;
      }
      if (onlyPromo && !p.highlight && !p.prevPrice) {
        return false;
      }
      return true;
    });

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.priceValue - b.priceValue);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.priceValue - a.priceValue);
    } else {
      list = [...list].sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [query, selectedCategories, selectedSizes, onlyPromo, sort]);

  function toggleCategory(c: ProductCategory) {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }
  function toggleSize(s: ProductSize) {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }
  function resetFilters() {
    setQuery("");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setOnlyPromo(false);
    setSort("relevance");
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedSizes.length +
    (onlyPromo ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const FiltersBody = (
    <div className="rounded-2xl border border-card-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-brand">
          Filtros
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[12px] font-semibold text-ink-muted hover:text-brand"
          >
            Limpiar
          </button>
        )}
      </div>

      <FilterSection title="Categoría">
        {CATEGORIES.map((c) => (
          <PillToggle
            key={c}
            active={selectedCategories.includes(c)}
            onClick={() => toggleCategory(c)}
          >
            {CATEGORY_LABEL[c]}
          </PillToggle>
        ))}
      </FilterSection>

      <FilterSection title="Formato">
        {SIZES.map((s) => (
          <PillToggle
            key={s}
            active={selectedSizes.includes(s)}
            onClick={() => toggleSize(s)}
          >
            {SIZE_LABEL[s]}
          </PillToggle>
        ))}
      </FilterSection>

      <FilterSection title="Otros">
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink">
          <input
            type="checkbox"
            checked={onlyPromo}
            onChange={(e) => setOnlyPromo(e.target.checked)}
            className="h-4 w-4 accent-[#1b22a6]"
          />
          Solo productos en promoción
        </label>
      </FilterSection>
    </div>
  );

  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <nav className="mx-auto max-w-page px-5 pt-6 text-[12px] text-ink-muted sm:px-8 sm:text-[13px] lg:px-12">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Productos</span>
        </nav>

        <section className="mx-auto max-w-page px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[26px] font-extrabold text-brand sm:text-[32px]">
                Productos PH PLUS
              </h1>
              <p className="mt-1 text-[14px] text-ink-muted">
                Hidratación alcalina PH 9 para cada momento del día.
              </p>
            </div>
            <p className="text-[13px] text-ink-muted">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
              {activeFiltersCount > 0 && ` · ${activeFiltersCount} filtro${activeFiltersCount === 1 ? "" : "s"} activo${activeFiltersCount === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-card-border bg-white px-4 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar agua, garrafas, dispensadores..."
                className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-muted"
              />
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-card-border bg-white px-4 py-2.5 text-[13px] font-semibold text-brand lg:hidden"
                aria-expanded={mobileFiltersOpen}
              >
                <FilterIcon />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <label className="flex items-center gap-2 rounded-full border border-card-border bg-white px-4 py-2.5 text-[13px] text-ink">
                <span className="hidden sm:inline text-ink-muted">Ordenar:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-transparent text-[13px] font-semibold text-brand outline-none"
                >
                  <option value="relevance">Más populares</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
            <aside className="hidden lg:block lg:sticky lg:top-24">
              {FiltersBody}
            </aside>

            {mobileFiltersOpen && (
              <div className="lg:hidden">{FiltersBody}</div>
            )}

            <div>
              {initialLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-card-border bg-[#fafbfd] p-10 text-center">
                  <p className="text-[16px] font-extrabold text-brand">
                    Sin resultados
                  </p>
                  <p className="mt-2 text-[14px] text-ink-muted">
                    Intenta con otra búsqueda o ajusta los filtros.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-dark"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.slug} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
