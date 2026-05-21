import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import ProductVisual from "../../components/ProductVisual";
import ProductGallery from "../../components/ProductGallery";
import ProductTabs from "../../components/ProductTabs";
import AddToCartButton from "../../components/AddToCartButton";
import type { Product } from "../../lib/products";
import { productRepo } from "@/src/features/catalog";

export const dynamic = "force-dynamic";

// generateStaticParams se omite a propósito: con `dynamic = "force-dynamic"`,
// cada slug se resuelve en runtime contra Supabase. Esto deja que los
// productos creados desde el admin aparezcan inmediatamente, sin necesidad
// de rebuild.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepo.bySlug(slug);
  if (!product) return { title: "Producto no encontrado — PH PLUS" };
  return {
    title: `${product.title} — PH PLUS`,
    description: product.tagline,
  };
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#eef0ff" />
      <path
        d="M7 12.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < Math.round(rating) ? "#f6c84a" : "#e5e6ea"}
          aria-hidden
        >
          <path d="M12 2.5l3 6 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.9 2.7 1.1-6.5L2.5 9.4 9 8.5z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepo.bySlug(slug);
  if (!product) notFound();

  // Cargamos todo el catálogo (o un subset por categoría) para construir
  // los relacionados.
  const all = await productRepo.list();
  const related: Product[] = all.items
    .filter((p: Product) => p.slug !== product.slug)
    .slice(0, 4);
  const waMessage = encodeURIComponent(
    `Hola, quiero comprar ${product.title} (${product.price}).`,
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
          <Link href="/productos" className="hover:underline">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.title}</span>
        </nav>

        <section className="mx-auto max-w-page px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <ProductGallery images={product.gallery} highlight={product.highlight} />
            </Reveal>

            <Reveal delay={120}>
              <div className="flex flex-col gap-4">
                {product.badge && (
                  <span className="inline-flex w-fit items-center rounded-full bg-accent-cyan px-3 py-1 text-[12px] font-bold text-brand">
                    {product.badge.sub}
                  </span>
                )}
                <h1 className="text-[26px] font-extrabold leading-tight text-brand sm:text-[32px] lg:text-[38px]">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <StarRow rating={product.rating.average} />
                  <span className="text-[13px] font-semibold text-ink">
                    {product.rating.average.toFixed(1)}
                  </span>
                  <span className="text-[12px] text-ink-muted">
                    ({product.rating.count} reseñas)
                  </span>
                  {product.inStock && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e6fbed] px-2.5 py-0.5 text-[11px] font-bold text-whatsapp-dark">
                      ● En stock
                    </span>
                  )}
                </div>

                <p className="text-[15px] text-ink-muted sm:text-[16px]">
                  {product.tagline}
                </p>

                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-[30px] font-extrabold text-brand sm:text-[34px]">
                    {product.price}
                  </span>
                  {product.prevPrice && (
                    <span className="text-[14px] text-ink-muted line-through">
                      {product.prevPrice}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[14px] leading-[1.6] text-ink sm:text-[15px]">
                  {product.description}
                </p>

                <div className="mt-3">
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-brand">
                    Lo más destacado
                  </p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {product.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-[14px] text-ink"
                      >
                        <CheckIcon />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-brand">
                    Incluye
                  </p>
                  <ul className="mt-3 list-disc pl-5 text-[14px] leading-[1.7] text-ink">
                    {product.includes.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <AddToCartButton
                    slug={product.slug}
                    variant="primary"
                    label="Agregar al carrito"
                  />
                  <a
                    href={`https://wa.me/573234392470?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(37,211,102,0.35)] transition-transform hover:scale-[1.03] hover:bg-whatsapp-dark"
                  >
                    <Image
                      src="/icons/whatsapp.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="h-5 w-5"
                    />
                    Comprar por WhatsApp
                  </a>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-ink-muted">
                  <Link href="/envios" className="hover:text-brand hover:underline">
                    Envíos a domicilio →
                  </Link>
                  <span>· Pago seguro · Respuesta rápida</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-page px-5 pb-12 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
          <Reveal>
            <ProductTabs
              longDescription={product.longDescription}
              specs={product.specs}
              usage={product.usage}
              reviews={product.reviews}
              rating={product.rating}
            />
          </Reveal>
        </section>

        <section className="border-t border-card-border bg-[#fafbfd] py-12 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
            <Reveal>
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-[18px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[22px] lg:text-[24px]">
                  Otros productos
                </h2>
                <Link
                  href="/productos"
                  className="text-[12px] font-semibold text-brand underline-offset-2 hover:underline sm:text-[13px]"
                >
                  Ver todos →
                </Link>
              </div>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((rp, i) => (
                <Reveal key={rp.slug} delay={100 + i * 100}>
                  <Link
                    href={`/productos/${rp.slug}`}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-card-border bg-white p-4 transition-shadow hover:shadow-[0_8px_22px_rgba(27,34,166,0.10)]"
                  >
                    <div className="grid h-28 w-full place-items-center rounded-xl bg-[#f4f5fa]">
                      <ProductVisual
                        visualKey={rp.visualKey}
                        className="h-24 w-auto"
                      />
                    </div>
                    <p className="text-[14px] font-bold leading-tight text-brand">
                      {rp.title}
                    </p>
                    <p className="mt-auto text-[16px] font-extrabold text-ink">
                      {rp.price}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
