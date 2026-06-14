"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductVisual from "../components/ProductVisual";
import AddToCartButton from "../components/AddToCartButton";
import { ProductCardSkeleton } from "../components/Skeletons";
import {
  CATEGORY_LABEL,
  SIZE_LABEL,
  type Product,
  type ProductCategory,
  type ProductSize,
} from "../lib/products";
import { productRepo } from "@/src/features/catalog";

type SortKey = "relevance" | "price-asc" | "price-desc";

type ProductSection = {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
};

const CATEGORIES = Object.keys(CATEGORY_LABEL) as ProductCategory[];
const SIZES = Object.keys(SIZE_LABEL) as ProductSize[];
const FEATURED_SLUGS = [
  "promocion-garrafas",
  "kit-inicial-botellon-19lts",
  "recarga-19lts-individual",
  "recargas-19lts",
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-[#6b7280]"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
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
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrustStrip() {
  return (
    <div className="mx-auto mt-4 flex max-w-[680px] flex-wrap items-center justify-center gap-3 px-5 lg:mt-4">
      <div className="ph-condensed flex h-[54px] min-w-[146px] items-center gap-3 rounded-[8px] border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[11px] leading-tight text-[#303030] shadow-[2px_3px_0_rgba(0,0,0,0.18)] lg:h-[42px] lg:min-w-[126px] lg:gap-2 lg:px-2 lg:text-[8px]">
        <Image
          src="/home/icon-truck.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 object-contain lg:h-6 lg:w-6"
        />
        <span>
          servicio a domicilio
          <br />
          a nivel nacional
        </span>
      </div>
      <div className="ph-condensed flex h-[54px] min-w-[146px] items-center gap-3 rounded-[8px] border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[11px] leading-tight text-[#303030] shadow-[2px_3px_0_rgba(0,0,0,0.18)] lg:h-[42px] lg:min-w-[126px] lg:gap-2 lg:px-2 lg:text-[8px]">
        <Image
          src="/home/icon-lock.png"
          alt=""
          width={34}
          height={34}
          className="h-8 w-8 object-contain lg:h-6 lg:w-6"
        />
        <span>
          pago seguro con SSL.
          <br />
          Bancolombia, Nequi, PSE
        </span>
      </div>
      <Link
        href="/envios"
        className="ph-condensed inline-flex h-[24px] min-w-[196px] items-center justify-center rounded-full border-2 border-[#1e3a8a] bg-white px-4 text-[10px] font-bold text-[#6b7280] shadow-[2px_3px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 lg:h-[22px] lg:min-w-[230px] lg:text-[9px]"
      >
        Ver costos de envío y tiempos de entrega
      </Link>
    </div>
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
        "ph-condensed rounded-full border px-3 py-1 text-[12px] font-bold transition-colors " +
        (active
          ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
          : "border-[#d9d9d9] bg-white text-[#1e3a8a] hover:border-[#1e3a8a]")
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
    <div className="border-b border-[#e5e7eb] py-4 last:border-b-0">
      <p className="ph-display text-[18px] uppercase leading-none text-[#1e3a8a]">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ProductTile({
  product,
  featured = false,
  className = "",
}: {
  product: Product;
  featured?: boolean;
  className?: string;
}) {
  const title = product.shortTitle || product.title;

  return (
    <article
      className={`ph-condensed flex min-w-0 flex-col items-center text-center ${className}`}
    >
      <Link
        href={`/productos/${product.slug}`}
        className={
          product.highlight
            ? "relative flex h-[132px] w-full flex-col items-center justify-end overflow-hidden rounded-[8px] bg-[#1e3a8a] px-2 pb-2 text-white lg:h-[180px]"
            : "relative grid w-full place-items-center rounded-[8px] bg-[#fbf9fb] " +
              (featured ? "h-[118px] lg:h-[132px]" : "h-[132px] lg:h-[150px]")
        }
        aria-label={`Ver detalles de ${product.title}`}
      >
        {product.highlight && (
          <div className="absolute inset-x-0 top-0 z-10">
            <div className="ph-display rounded-t-[8px] bg-[#243a95] px-2 py-1 text-center text-[12px] uppercase leading-none lg:text-[16px]">
              Promoción garrafas
            </div>
            <div className="ph-condensed -mx-1 rounded-full bg-[#4fc8d2] px-2 py-0.5 text-center text-[11px] font-bold leading-none lg:text-[14px]">
              ¡Pague 3, lleve 5!
            </div>
            <div className="ph-condensed mt-1 text-center text-[20px] font-bold leading-none lg:text-[28px]">
              por {product.price}
            </div>
            {product.prevPrice && (
              <div className="ph-condensed text-center text-[8px] font-bold leading-none lg:text-[11px]">
                (antes {product.prevPrice})
              </div>
            )}
          </div>
        )}
        <ProductVisual
          visualKey={product.visualKey}
          className={
            product.highlight
              ? "h-[82px] w-auto lg:h-[92px]"
              : product.visualKey === "garrafas"
                ? "h-[96px] w-auto lg:h-[116px]"
                : "h-[102px] w-auto lg:h-[118px]"
          }
        />
      </Link>

      {!product.highlight && (
        <div className="mt-2 min-h-[64px] lg:min-h-[70px]">
          <div className="flex items-baseline justify-center gap-1">
            {product.prevPrice && (
              <span className="text-[11px] font-bold leading-none text-[#ef4444] line-through lg:text-[12px]">
                {product.prevPrice}
              </span>
            )}
            <p className="text-[18px] font-bold leading-none text-[#1e3a8a] lg:text-[16px]">
              {product.price}
            </p>
          </div>
          <Link
            href={`/productos/${product.slug}`}
            className="mt-2 block max-w-[92px] whitespace-pre-line text-[11px] font-bold leading-[1.15] text-[#6b7280] hover:text-[#1e3a8a] lg:max-w-[118px] lg:text-[10px]"
          >
            {title}
          </Link>
        </div>
      )}

      <AddToCartButton
        slug={product.slug}
        mode="buy"
        variant="primary"
        label="comprar ahora"
        className="mt-1 h-[20px] w-full max-w-[86px] !gap-1 !px-0 !py-0 !text-[7px] font-bold lg:h-[18px] lg:max-w-[88px] lg:!text-[7px] [&_svg]:h-3 [&_svg]:w-3"
      />
    </article>
  );
}

function SectionHeader({
  title,
  subtitle,
  compact = false,
}: {
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div className="text-center">
      <h2
        className={
          "ph-display uppercase leading-none text-[#1e3a8a] " +
          (compact ? "text-[26px] lg:text-[30px]" : "text-[30px] lg:text-[34px]")
        }
      >
        {title}
      </h2>
      <p
        className={
          "ph-condensed mt-2 font-bold leading-tight text-[#6b7280] " +
          (compact ? "text-[18px] lg:text-[17px]" : "text-[22px] lg:text-[24px]")
        }
      >
        {subtitle}
      </p>
    </div>
  );
}

function ProductsGrid({
  products,
  featured = false,
}: {
  products: Product[];
  featured?: boolean;
}) {
  return (
    <div
      className={
        featured
          ? "mt-5 grid grid-cols-3 items-end gap-5 lg:mt-0 lg:grid-cols-4 lg:gap-5"
          : "mt-7 grid grid-cols-3 gap-x-5 gap-y-9 lg:gap-x-7 lg:gap-y-10"
      }
    >
      {products.map((product, index) => (
        <ProductTile
          key={product.slug}
          product={product}
          featured={featured}
          className={featured && index === 3 ? "hidden lg:flex" : ""}
        />
      ))}
    </div>
  );
}

function FeaturedProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="lg:hidden">
        <SectionHeader
          title="Productos destacados"
          subtitle="Ahorra más, disfruta más cada día"
        />
        <ProductsGrid products={products} featured />
      </div>

      <div className="relative hidden rounded-[28px] border border-[#d7d7d7] bg-white px-5 pb-5 pt-4 shadow-[3px_4px_16px_rgba(0,0,0,0.18)] lg:block">
        <div className="absolute left-[170px] top-3 z-20 text-left">
          <h2 className="ph-display text-[24px] uppercase leading-none text-[#1e3a8a]">
            Presentaciones destacadas:
          </h2>
          <p className="ph-condensed text-[16px] font-bold leading-none text-[#6b7280]">
            Ahorra más, disfruta más cada día
          </p>
        </div>
        <div className="pt-10">
          <ProductsGrid products={products} featured />
        </div>
      </div>
    </section>
  );
}

function PetProductsSection({ section }: { section: ProductSection }) {
  if (section.products.length === 0) return null;

  const [first, second, third, ...rest] = section.products;

  return (
    <section id={section.id} className="pt-12 lg:pt-14">
      <div className="lg:hidden">
        <SectionHeader title={section.title} subtitle={section.subtitle} />
        <ProductsGrid products={section.products} />
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-4 items-start gap-x-7 gap-y-10">
          {[first, second, third].filter(Boolean).map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
          <div className="pt-6">
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              compact
            />
          </div>
          {rest.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitProductSections({ sections }: { sections: ProductSection[] }) {
  const visible = sections.filter((section) => section.products.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="grid gap-12 pt-12 lg:grid-cols-2 lg:gap-10 lg:pt-14">
      {visible.map((section) => (
        <section key={section.id} id={section.id}>
          <SectionHeader
            title={section.title}
            subtitle={section.subtitle}
            compact
          />
          <div className="mt-7 grid grid-cols-2 gap-x-7 gap-y-9">
            {section.products.slice(0, 2).map((product) => (
              <ProductTile key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ProductsListingPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const initialLoading = products == null;

  useEffect(() => {
    let cancelled = false;
    productRepo
      .list()
      .then((result) => {
        if (!cancelled) setProducts(result.items);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.tagline.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)
      ) {
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
  }, [products, query, selectedCategories, selectedSizes, onlyPromo, sort]);

  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug))
      .filter((product): product is Product => Boolean(product))
      .slice(0, 4);
  }, [products]);

  const defaultSections = useMemo<ProductSection[]>(() => {
    if (!products) return [];
    const featuredSlugs = new Set(FEATURED_SLUGS);
    const remaining = products.filter((product) => !featuredSlugs.has(product.slug));

    return [
      {
        id: "pet",
        title: "Presentaciones en PET",
        subtitle: "Llévalas donde vayas, prácticas, seguras y libre de BPA",
        products: remaining.filter(
          (product) =>
            product.category === "garrafa" ||
            product.category === "botellon" ||
            product.category === "recarga",
        ),
      },
      {
        id: "vidrio",
        title: "Presentaciones en vidrio",
        subtitle: "Eleva tu estilo a nivel premium",
        products: remaining.filter((product) =>
          product.title.toLowerCase().includes("vidrio"),
        ),
      },
      {
        id: "saborizadas",
        title: "Presentaciones saborizadas en PET",
        subtitle: "Disfruta el agua que sabe diferente",
        products: remaining.filter((product) => {
          const title = product.title.toLowerCase();
          return title.includes("sabor") || title.includes("limonaria");
        }),
      },
    ];
  }, [products]);

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
    setMobileFiltersOpen(false);
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedSizes.length +
    (onlyPromo ? 1 : 0) +
    (query.trim() ? 1 : 0);
  const hasActiveFilters = activeFiltersCount > 0;

  const FiltersBody = (
    <div className="rounded-[8px] border border-[#d7d7d7] bg-white p-4 shadow-[3px_4px_0_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between">
        <h2 className="ph-display text-[24px] uppercase leading-none text-[#1e3a8a]">
          Filtros
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="ph-condensed text-[12px] font-bold text-[#6b7280] hover:text-[#1e3a8a]"
          >
            Limpiar
          </button>
        )}
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-full border border-[#d7d7d7] bg-white px-3 py-2 focus-within:border-[#1e3a8a]">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#303030] outline-none placeholder:text-[#6b7280]"
        />
      </label>

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
        <label className="ph-condensed flex cursor-pointer items-center gap-2 text-[13px] font-bold text-[#303030]">
          <input
            type="checkbox"
            checked={onlyPromo}
            onChange={(e) => setOnlyPromo(e.target.checked)}
            className="h-4 w-4 accent-[#1e3a8a]"
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
        <TrustStrip />

        <section className="mx-auto max-w-[430px] px-8 pb-12 pt-7 sm:px-10 lg:max-w-[760px] lg:px-10 lg:pt-5">
          <div className="hidden justify-end lg:flex">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="ph-condensed inline-flex items-center gap-2 rounded-full border-2 border-[#1e3a8a] bg-white px-4 py-1.5 text-[12px] font-bold text-[#1e3a8a] shadow-[2px_3px_0_rgba(0,0,0,0.25)] lg:px-5 lg:py-1 lg:text-[10px]"
              aria-expanded={mobileFiltersOpen}
            >
              <FilterIcon />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#1e3a8a] px-1 text-[10px] text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {mobileFiltersOpen && (
            <div className="mt-4">{FiltersBody}</div>
          )}

          {mobileFiltersOpen && (
            <label className="mt-4 flex items-center gap-2 rounded-full border border-[#d7d7d7] bg-white px-3 py-2 text-[13px] text-[#303030]">
              <span className="ph-condensed font-bold text-[#6b7280]">
                Ordenar
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-[#1e3a8a] outline-none"
              >
                <option value="relevance">Más populares</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </label>
          )}

          <div className="mt-5">
              {initialLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-[18px] border border-[#d7d7d7] bg-[#fafbfd] p-10 text-center">
                  <p className="ph-display text-[28px] uppercase leading-none text-[#1e3a8a]">
                    Sin resultados
                  </p>
                  <p className="ph-condensed mt-2 text-[16px] font-bold text-[#6b7280]">
                    Intenta con otra búsqueda o ajusta los filtros.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ph-condensed mt-5 rounded-full bg-[#1e3a8a] px-5 py-2 text-[13px] font-bold text-white"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : hasActiveFilters ? (
                <section>
                  <SectionHeader
                    title="Resultados"
                    subtitle={`${filtered.length} producto${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`}
                  />
                  <ProductsGrid products={filtered} />
                </section>
              ) : (
                <>
                  <FeaturedProductsSection products={featuredProducts} />

                  <PetProductsSection section={defaultSections[0]} />
                  <SplitProductSections
                    sections={defaultSections.slice(1)}
                  />

                  <section className="mx-auto mt-14 max-w-[560px] rounded-[18px] bg-[#1e3a8a] px-6 py-5 text-center text-white shadow-[3px_5px_0_rgba(0,0,0,0.24)] lg:px-10">
                    <h2 className="ph-condensed text-[22px] font-bold leading-tight lg:text-[28px]">
                      ¡Descubre la presentación perfecta para ti!
                    </h2>
                    <p className="ph-condensed mt-4 text-[15px] leading-relaxed opacity-90 lg:text-[18px]">
                      Cada estilo de vida es diferente, cada rutina es única.
                      Te ayudamos a encontrar tu presentación ideal.
                    </p>
                  </section>
                </>
              )}
          </div>
        </section>

        <section className="px-5 pb-10 text-center">
          <h2 className="ph-condensed mx-auto max-w-[640px] text-[27px] font-bold leading-tight text-[#1e3a8a] lg:text-[34px]">
            Miles de familias ya nos eligieron.
            <br />
            ¿Cuándo te toca a ti?
          </h2>
          <p className="ph-condensed mt-7 text-[14px] font-bold text-[#6b7280] lg:text-[20px]">
            Compra fácil por WhatsApp y recíbelo en casa.
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href="https://wa.me/573234392470"
              target="_blank"
              rel="noopener noreferrer"
              className="ph-condensed inline-flex h-[31px] items-center gap-2 rounded-full bg-[#2f6b4f] px-3 text-[10px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.45)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] lg:h-[46px] lg:px-7 lg:text-[18px]"
            >
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={26}
                height={26}
                className="h-6 w-6 lg:h-8 lg:w-8"
              />
              Comprar por whatsapp
            </a>
          </div>
          <p className="ph-condensed mt-5 text-[14px] font-bold text-[#6b7280] lg:text-[18px]">
            Respuesta rápida • Entrega a domicilio
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
