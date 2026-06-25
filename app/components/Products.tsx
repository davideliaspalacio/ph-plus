import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "../lib/products";

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
                  <Link
                    href={`/productos/${product.slug}`}
                    className="ph-condensed inline-flex h-[18px] w-[76px] items-center justify-center gap-0.5 rounded-full border border-black bg-[#1e3a8a] px-0 py-0 text-[7px] font-bold text-white transition-transform hover:scale-[1.03] hover:bg-[#1e2aab] sm:h-[40px] sm:w-[180px] sm:gap-1.5 sm:text-[16px] lg:h-[58px] lg:w-[250px] lg:gap-2 lg:text-[24px]"
                  >
                    <svg
                      viewBox="0 0 48 46"
                      className="h-3 w-3 sm:h-6 sm:w-6 lg:h-9 lg:w-9"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 2H10L15.36 28.78C15.5429 29.7008 16.0438 30.5279 16.7751 31.1166C17.5064 31.7053 18.4214 32.018 19.36 32H38.8C39.7386 32.018 40.6536 31.7053 41.3849 31.1166C42.1162 30.5279 42.6171 29.7008 42.8 28.78L46 12H12M20 42C20 43.1046 19.1046 44 18 44C16.8954 44 16 43.1046 16 42C16 40.8954 16.8954 40 18 40C19.1046 40 20 40.8954 20 42ZM42 42C42 43.1046 41.1046 44 40 44C38.8954 44 38 43.1046 38 42C38 40.8954 38.8954 40 40 40C41.1046 40 42 40.8954 42 42Z"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    comprar ahora
                  </Link>
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
