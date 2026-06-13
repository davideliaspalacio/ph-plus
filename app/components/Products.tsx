import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "../lib/products";
import AddToCartButton from "./AddToCartButton";
import Reveal from "./Reveal";

const FEATURED = [
  {
    slug: "kit-inicial-botellon-19lts",
    image: "/products/botellon-kit.png",
    alt: "Kit inicial de botellón PH PLUS de 19 litros",
    imageClassName: "lg:h-[360px] lg:max-w-[300px]",
    copyClassName: "",
  },
  {
    slug: "promocion-garrafas",
    image: "/products/oferta-garrafas.png",
    alt: "Promoción de garrafas PH PLUS pague 3 lleve 5",
    imageClassName: "lg:h-[470px] lg:max-w-[380px]",
    copyClassName: "hidden",
  },
  {
    slug: "recargas-19lts",
    image: "/products/recargas-19.png",
    alt: "Dos recargas de botellón PH PLUS de 19 litros",
    imageClassName: "lg:h-[370px] lg:max-w-[315px]",
    copyClassName: "",
  },
];

function productBySlug(slug: string) {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    throw new Error(`Featured product ${slug} was not found`);
  }
  return product;
}

export default function Products() {
  return (
    <section id="productos" className="w-full bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-6 lg:py-11">
        <Reveal>
          <h2 className="ph-display text-center text-[40px] uppercase leading-none text-[#1e3a8a] sm:text-[48px] lg:text-[48px]">
            PRODUCTOS DESTACADOS
          </h2>
          <p className="ph-condensed mt-2 text-center text-[26px] font-bold leading-none text-[#6b7280] sm:text-[32px] lg:text-[32px]">
            Ahorra más, disfruta más cada día
          </p>
        </Reveal>

        <div className="mt-9 grid grid-cols-1 items-end gap-10 md:grid-cols-3 lg:mt-8 lg:gap-8">
          {FEATURED.map((item) => {
            const product = productBySlug(item.slug);
            return (
              <article
                key={item.slug}
                className="flex flex-col items-center text-center"
              >
                <Link
                  href={`/productos/${product.slug}`}
                  aria-label={`Ver detalles de ${product.title}`}
                  className={
                    "relative block h-[330px] w-full max-w-[330px] " +
                    item.imageClassName
                  }
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 480px, 90vw"
                    className="object-contain lg:scale-[1.2]"
                  />
                </Link>

                <div
                  className={
                    "ph-condensed mt-4 flex min-h-[100px] flex-col items-center " +
                    item.copyClassName
                  }
                >
                  <p className="text-[24px] font-bold leading-none text-[#1e3a8a]">
                    {product.price}
                  </p>
                  {product.shortTitle && (
                    <p className="mt-2 whitespace-pre-line text-[27px] font-bold leading-[1.22] text-[#6b7280]">
                      {product.shortTitle}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex justify-center">
                  <AddToCartButton
                    slug={product.slug}
                    mode="buy"
                    variant="primary"
                    label="comprar ahora"
                    className="ph-condensed h-[56px] w-[240px] border border-black !py-0 !text-[22px] font-bold lg:h-[58px] lg:w-[250px] lg:!text-[24px] [&_svg]:h-8 [&_svg]:w-8 lg:[&_svg]:h-9 lg:[&_svg]:w-9"
                  />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            href="/envios"
            className="ph-condensed inline-flex h-[52px] min-w-[300px] items-center justify-center rounded-[32px] border-[4px] border-[#1e3a8a] bg-white/10 px-7 text-center text-[20px] font-bold leading-none text-[#6b7280] shadow-[6px_8px_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 sm:min-w-[500px] lg:min-w-[560px] lg:text-[22px]"
          >
            Ver destinos, costos de envío y tiempos de entrega
          </Link>
        </div>
      </div>
    </section>
  );
}
