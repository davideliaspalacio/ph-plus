import Link from "next/link";
import { PRODUCTS } from "../lib/products";
import AddToCartButton from "./AddToCartButton";
import ProductVisual from "./ProductVisual";
import Reveal from "./Reveal";

export default function Products() {
  return (
    <section id="productos" className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="text-center text-[22px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[26px] lg:text-[28px]">
            Elige cómo quieres hidratarte
          </h2>
          <p className="mt-3 text-center text-[14px] font-semibold text-brand sm:text-[16px]">
            Ahorra más, disfruta más cada día
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1080px] grid-cols-1 items-end gap-8 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={100 + i * 120}>
              <article
                className={
                  "relative flex h-full flex-col items-center text-center " +
                  (p.highlight
                    ? "rounded-2xl bg-[#eef3fb] pb-6 pt-4 sm:col-span-2 lg:col-span-1"
                    : "")
                }
              >
                {p.badge && (
                  <div className="w-full px-4">
                    <div className="rounded-xl bg-brand px-4 py-2 text-white">
                      <p className="text-center text-[13px] font-extrabold tracking-wide sm:text-[14px]">
                        {p.badge.title}
                      </p>
                    </div>
                    <div className="mt-3 rounded-full bg-accent-cyan px-4 py-1.5">
                      <p className="text-center text-[13px] font-bold text-brand sm:text-[14px]">
                        {p.badge.sub}
                      </p>
                    </div>
                  </div>
                )}

                <Link
                  href={`/productos/${p.slug}`}
                  className="mt-3 flex h-48 w-full items-end justify-center sm:h-52"
                  aria-label={`Ver detalles de ${p.title}`}
                >
                  <ProductVisual
                    visualKey={p.visualKey}
                    className="h-40 w-auto transition-transform duration-300 hover:scale-105 sm:h-44"
                  />
                </Link>

                <div className="mt-2 flex flex-col items-center">
                  <p
                    className={
                      "font-extrabold " +
                      (p.highlight
                        ? "text-[24px] text-brand sm:text-[28px]"
                        : "text-[18px] text-ink sm:text-[20px]")
                    }
                  >
                    {p.highlight ? `por ${p.price}` : p.price}
                  </p>
                  {p.prevPrice && (
                    <p className="text-[12px] text-ink-muted">
                      (antes {p.prevPrice})
                    </p>
                  )}
                  {p.shortTitle && (
                    <p className="mt-2 whitespace-pre-line text-[13px] font-medium text-ink sm:text-[14px]">
                      {p.shortTitle}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex w-full flex-col items-stretch gap-2 px-4">
                  <AddToCartButton
                    slug={p.slug}
                    mode="add"
                    variant="primary"
                    label="Agregar al carrito"
                    className="w-full"
                  />
                  <AddToCartButton
                    slug={p.slug}
                    mode="buy"
                    variant="outline"
                    label="Comprar ahora"
                    showIcon={false}
                    className="w-full"
                  />
                  <Link
                    href={`/productos/${p.slug}`}
                    className="text-center text-[12px] font-semibold text-brand underline-offset-2 hover:underline"
                  >
                    Ver detalles
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark sm:text-[14px]"
          >
            Ver todos los productos
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/envios"
            className="text-[12px] font-semibold text-brand underline-offset-2 hover:underline sm:text-[13px]"
          >
            Ver costos de envío y tiempos de entrega →
          </Link>
        </div>
      </div>
    </section>
  );
}
