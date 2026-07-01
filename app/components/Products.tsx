import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "../lib/products";

type FeaturedItem = {
  slug: string;
  image: string;
  alt: string;
  articleClassName: string;
  imageClassName: string;
  imageFrameClassName?: string;
  imageInnerClassName?: string;
  copyClassName: string;
  titleOverride?: string;
  titleClassName?: string;
};

const FEATURED: FeaturedItem[] = [
  {
    slug: "kit-inicial-botellon-19lts",
    image: "/products/botellon-kit.png",
    alt: "Kit inicial de botellón PH PLUS de 19 litros",
    articleClassName: "order-2 md:order-1",
    imageClassName: "h-[148px] max-w-[112px] lg:h-[354px] lg:max-w-[300px]",
    imageFrameClassName:
      "overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] lg:rounded-[18px] lg:border-[#d9d9d9] lg:shadow-[0_1px_5px_rgba(0,0,0,0.16)]",
    imageInnerClassName: "p-2 lg:p-6",
    copyClassName: "",
  },
  {
    slug: "promocion-garrafas",
    image: "/products/oferta-garrafas.png",
    alt: "Promoción de garrafas PH PLUS pague 3 lleve 5",
    articleClassName: "order-1 md:order-2",
    imageClassName: "h-[172px] max-w-[140px] lg:h-[380px] lg:max-w-[355px]",
    copyClassName: "",
    titleOverride: "Promoción de Garrafas",
    titleClassName: "hidden lg:block",
  },
  {
    slug: "recargas-19lts",
    image: "/products/recargas-19.png",
    alt: "Dos recargas de botellón PH PLUS de 19 litros",
    articleClassName: "order-3 md:order-3",
    imageClassName: "h-[148px] max-w-[112px] lg:h-[354px] lg:max-w-[300px]",
    imageFrameClassName:
      "overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] lg:rounded-[18px] lg:border-[#d9d9d9] lg:shadow-[0_1px_5px_rgba(0,0,0,0.16)]",
    imageInnerClassName: "p-2 lg:p-5",
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
      <div className="mx-auto max-w-[1230px] px-4 pb-4 pt-4 sm:px-8 sm:py-10 lg:px-6 lg:pb-8 lg:pt-20">
        <div>
          <h2 className="ph-display text-center text-[24px] uppercase leading-none text-[#1e3a8a] sm:text-[40px] lg:text-[48px]">
            PRODUCTOS DESTACADOS
          </h2>
          <p className="ph-condensed mt-2 text-center text-[20px] font-bold leading-none text-[#6b7280] sm:text-[26px] lg:text-[32px]">
            Ahorra más, disfruta más cada día
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 items-end gap-3 md:gap-6 lg:mt-9 lg:gap-14">
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
                    item.imageClassName +
                    (item.imageFrameClassName
                      ? " " + item.imageFrameClassName
                      : "")
                  }
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 480px, 34vw"
                    className={
                      "object-contain lg:scale-[1.08]" +
                      (item.imageInnerClassName
                        ? " " + item.imageInnerClassName
                        : "")
                    }
                  />
                </Link>

                <div
                  className={
                    "ph-condensed mt-2 flex min-h-[70px] flex-col items-center lg:mt-8 lg:min-h-[115px] " +
                    item.copyClassName
                  }
                >
                  {product.prevPrice ? (
                    <div className="flex flex-col items-center justify-center gap-1 lg:flex-row lg:items-baseline lg:gap-4">
                      <span className="text-[22px] font-bold leading-none text-[#ef4444] line-through lg:text-[24px]">
                        {product.prevPrice}
                      </span>
                      <p className="text-[22px] font-bold leading-none text-[#1e3a8a] lg:text-[24px]">
                        {product.price}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[22px] font-bold leading-none text-[#1e3a8a] lg:text-[24px]">
                      {product.price}
                    </p>
                  )}
                  {(item.titleOverride || product.shortTitle) && (
                    <p
                      className={
                        "mt-2 whitespace-pre-line text-[14px] font-bold leading-[1.15] text-[#6b7280] lg:mt-3 lg:text-[27px] lg:leading-[1.22]" +
                        (item.titleClassName
                          ? " " + item.titleClassName
                          : "")
                      }
                    >
                      {item.titleOverride || product.shortTitle}
                    </p>
                  )}
                </div>

                <div className="mt-1 flex justify-center lg:mt-4">
                  <Link
                    href={`/productos/${product.slug}`}
                    className="ph-condensed inline-flex h-[26px] w-[104px] items-center justify-center gap-1 rounded-full border border-black bg-[#1e3a8a] px-2 text-[9px] font-bold text-white transition-transform hover:scale-[1.03] hover:bg-[#1e2aab] sm:h-[36px] sm:w-[150px] sm:gap-1.5 sm:text-[14px] lg:h-[68px] lg:w-[294px] lg:gap-3 lg:text-[29px]"
                  >
                    <svg
                      viewBox="0 0 48 46"
                      className="h-4 w-4 sm:h-5 sm:w-5 lg:h-10 lg:w-10"
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
            scroll
            className="ph-condensed inline-flex min-h-[30px] w-[min(300px,calc(100vw-56px))] items-center justify-center rounded-[18px] border-2 border-[#1e3a8a] bg-white/10 px-4 text-center text-[10px] font-bold leading-none text-[#6b7280] shadow-[3px_4px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 sm:min-h-[38px] sm:w-[340px] sm:text-[15px] lg:min-h-[64px] lg:w-auto lg:min-w-[590px] lg:rounded-[34px] lg:border-[4px] lg:px-8 lg:text-[25px] lg:shadow-[8px_9px_0_rgba(0,0,0,0.35)]"
          >
            Ver destinos, costos de envío y tiempos de entrega
          </Link>
        </div>
      </div>
    </section>
  );
}
