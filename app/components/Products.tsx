import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "../lib/products";
import AddToCartButton from "./AddToCartButton";

const FEATURED = [
  {
    slug: "kit-inicial-botellon-19lts",
    image: "/products/botellon-kit.png",
    alt: "Kit inicial de botellón PH PLUS de 19 litros",
    articleClassName: "order-2 md:order-1",
    imageClassName: "h-[138px] max-w-[102px] lg:h-[360px] lg:max-w-[300px]",
    copyClassName: "",
  },
  {
    slug: "promocion-garrafas",
    image: "/products/oferta-garrafas.png",
    alt: "Promoción de garrafas PH PLUS pague 3 lleve 5",
    articleClassName: "order-1 md:order-2",
    imageClassName: "h-[176px] max-w-[127px] lg:h-[470px] lg:max-w-[380px]",
    copyClassName: "hidden",
  },
  {
    slug: "recargas-19lts",
    image: "/products/recargas-19.png",
    alt: "Dos recargas de botellón PH PLUS de 19 litros",
    articleClassName: "order-3 md:order-3",
    imageClassName: "h-[138px] max-w-[102px] lg:h-[370px] lg:max-w-[315px]",
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
      <div className="mx-auto max-w-[1180px] px-4 pb-4 pt-4 sm:px-8 sm:py-10 lg:px-6 lg:py-11">
        <div>
          <h2 className="ph-display text-center text-[24px] uppercase leading-none text-[#1e3a8a] sm:text-[40px] lg:text-[48px]">
            PRODUCTOS DESTACADOS
          </h2>
          <p className="ph-condensed mt-2 text-center text-[20px] font-bold leading-none text-[#6b7280] sm:text-[26px] lg:text-[32px]">
            Ahorra más, disfruta más cada día
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 items-end gap-1.5 md:gap-6 lg:mt-8 lg:gap-8">
          {FEATURED.map((item) => {
            const product = productBySlug(item.slug);
            return (
              <article
                key={item.slug}
                className={
                  "flex min-w-0 flex-col items-center text-center " +
                  item.articleClassName
                }
              >
                <Link
                  href={`/productos/${product.slug}`}
                  aria-label={`Ver detalles de ${product.title}`}
                  className={
                    "relative block w-full " +
                    item.imageClassName
                  }
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 480px, 34vw"
                    className="object-contain lg:scale-[1.2]"
                  />
                </Link>

                <div
                  className={
                    "ph-condensed mt-1 flex min-h-[54px] flex-col items-center lg:mt-4 lg:min-h-[100px] " +
                    item.copyClassName
                  }
                >
                  <p className="text-[18px] font-bold leading-none text-[#1e3a8a] lg:text-[24px]">
                    {product.price}
                  </p>
                  {product.shortTitle && (
                    <p className="mt-2 whitespace-pre-line text-[12px] font-bold leading-[1.15] text-[#6b7280] lg:text-[27px] lg:leading-[1.22]">
                      {product.shortTitle}
                    </p>
                  )}
                </div>

                <div className="mt-1 flex justify-center lg:mt-3">
                  <AddToCartButton
                    slug={product.slug}
                    mode="buy"
                    variant="primary"
                    label="comprar ahora"
                    className="ph-condensed h-[18px] w-[76px] !gap-0.5 border border-black !px-0 !py-0 !text-[7px] font-bold sm:h-[40px] sm:w-[180px] sm:!gap-1.5 sm:!text-[16px] lg:h-[58px] lg:w-[250px] lg:!gap-2 lg:!text-[24px] [&_svg]:h-3 [&_svg]:w-3 sm:[&_svg]:h-6 sm:[&_svg]:w-6 lg:[&_svg]:h-9 lg:[&_svg]:w-9"
                  />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 flex justify-center lg:mt-9">
          <Link
            href="/envios"
            className="ph-condensed inline-flex h-[23px] min-w-[205px] items-center justify-center rounded-[16px] border-2 border-[#1e3a8a] bg-white/10 px-3 text-center text-[9px] font-bold leading-none text-[#6b7280] shadow-[3px_4px_0_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 sm:h-[42px] sm:min-w-[360px] sm:text-[16px] lg:h-[52px] lg:min-w-[560px] lg:rounded-[32px] lg:border-[4px] lg:px-7 lg:text-[22px] lg:shadow-[6px_8px_0_rgba(0,0,0,0.4)]"
          >
            Ver destinos, costos de envío y tiempos de entrega
          </Link>
        </div>
      </div>
    </section>
  );
}
