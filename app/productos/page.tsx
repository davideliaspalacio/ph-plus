import Image from "next/image";
import Link from "next/link";

import Footer from "../components/Footer";
import Header from "../components/Header";
import AddToCartButton from "../components/AddToCartButton";
import ProductVisual from "../components/ProductVisual";
import { formatCOP, type ProductVisualKey } from "../lib/products";
import { productRepo } from "@/src/features/catalog";

type CatalogItem = {
  name: string;
  price: string;
  previousPrice?: string;
  visualKey: ProductVisualKey;
  image?: string;
  imageClassName?: string;
  slug: string;
};

type CatalogSection = {
  id: string;
  title: string;
  subtitle: React.ReactNode;
  products: CatalogItem[];
};

const WHATSAPP_NUMBER = "573234392470";

function DeliveryTruckIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 shrink-0 text-black lg:h-11 lg:w-11"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 18h34v27H7V18zM41 27h9l8 10v8H41V27z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="49" r="5" fill="white" stroke="currentColor" strokeWidth="4" />
      <circle cx="49" cy="49" r="5" fill="white" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

function SecureLockIcon() {
  return (
    <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#d9dde2] lg:h-11 lg:w-11">
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden>
        <path
          d="M15 21v-5a9 9 0 0118 0v5"
          fill="none"
          stroke="#8b98a3"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect x="11" y="20" width="26" height="22" rx="3" fill="#ffb52e" />
      </svg>
    </span>
  );
}

const FEATURED_PRODUCTS_STATIC: CatalogItem[] = [
  {
    name: "Promoción garrafas",
    price: "$73,470",
    previousPrice: "$122,450",
    visualKey: "garrafas",
    image: "/products/oferta-garrafas.png",
    imageClassName: "h-[178px] lg:h-[178px]",
    slug: "promocion-garrafas",
  },
  {
    name: "Kit inicial de\nbotellón 19 lts",
    price: "$85,000",
    visualKey: "kit",
    image: "/products/botellon-kit.png",
    imageClassName: "h-[155px] lg:h-[170px]",
    slug: "kit-inicial-botellon-19lts",
  },
  {
    name: "1 recarga\nde 19 lts",
    price: "$50,000",
    visualKey: "recargas",
    image: "/products/recargas-19.png",
    imageClassName: "h-[155px] lg:h-[170px]",
    slug: "recarga-19lts-individual",
  },
  {
    name: "2 recargas\ncada una de 19 lts",
    price: "$69,000",
    visualKey: "recargas",
    image: "/products/recargas-19.png",
    imageClassName: "h-[155px] lg:h-[170px]",
    slug: "recargas-19lts",
  },
];

const PET_PRODUCTS_STATIC: CatalogItem[] = [
  {
    name: "agua ph plus 300\nml KIDS x 24 ud",
    price: "$57,600",
    visualKey: "garrafas",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "agua-ph-plus-kids-300ml-x24",
  },
  {
    name: "agua ph plus 300\nml x 24 ud",
    price: "$57,600",
    visualKey: "garrafas",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "agua-ph-plus-300ml-x24",
  },
  {
    name: "agua ph plus 500\nml sport x 12 ud",
    price: "$50,160",
    visualKey: "kit",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "agua-ph-plus-sport-500ml-x12",
  },
  {
    name: "agua ph plus 500\nml x 12 ud",
    price: "$48,480",
    visualKey: "kit",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "agua-ph-plus-500ml-x12",
  },
  {
    name: "agua ph plus FIT\n1LT x 6 ud",
    price: "$35,376",
    previousPrice: "$44,220",
    visualKey: "garrafas",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "agua-ph-plus-fit-1l-x6",
  },
  {
    name: "agua ph plus\n1LT x 6 ud",
    price: "$50,160",
    visualKey: "kit",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "agua-ph-plus-1l-x6",
  },
  {
    name: "agua ph plus 5LT x\n1ud",
    price: "$24,490",
    visualKey: "kit",
    imageClassName: "h-[132px] lg:h-[138px]",
    slug: "agua-ph-plus-5l-x1",
  },
  {
    name: "1 recarga\nde 19 lts",
    price: "$50,000",
    visualKey: "recargas",
    imageClassName: "h-[132px] lg:h-[138px]",
    slug: "recarga-19lts-individual",
  },
];

const LOWER_SECTIONS_STATIC: CatalogSection[] = [
  {
    id: "vidrio",
    title: "Presentaciones en vidrio",
    subtitle: "Eleva tu estilo a nivel premium",
    products: [
      {
        name: "agua ph plus vidrio\n280 ml x 24 ud",
        price: "$108,000",
        visualKey: "kit",
        imageClassName: "h-[140px] lg:h-[148px]",
        slug: "agua-ph-plus-vidrio-280ml-x24",
      },
      {
        name: "agua ph plus vidrio\n477 ml x 24 ud",
        price: "$132,000",
        visualKey: "kit",
        imageClassName: "h-[140px] lg:h-[148px]",
        slug: "agua-ph-plus-vidrio-477ml-x24",
      },
    ],
  },
  {
    id: "saborizadas",
    title: "Presentaciones saborizadas en PET",
    subtitle: "Disfruta el agua que sabe diferente",
    products: [
      {
        name: "agua SABORIZADA\nph plus HIERBABUENA\n500 ml x 12 ud",
        price: "$63,600",
        visualKey: "garrafas",
        imageClassName: "h-[128px] lg:h-[136px]",
        slug: "agua-ph-plus-hierbabuena-500ml-x12",
      },
      {
        name: "agua SABORIZADA\nph plus LIMONARIA\n500 ml x 12 ud",
        price: "$63,600",
        visualKey: "garrafas",
        imageClassName: "h-[128px] lg:h-[136px]",
        slug: "agua-ph-plus-limonaria-500ml-x12",
      },
    ],
  },
];

function whatsappHref(item?: CatalogItem) {
  const message = item
    ? `Hola, quiero comprar ${item.name.replace(/\n/g, " ")} (${item.price}).`
    : "Hola, quiero comprar productos PH PLUS.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function TrustStrip() {
  return (
    <div className="mx-auto mt-8 grid max-w-[330px] grid-cols-2 items-center justify-center gap-3 px-4 lg:mt-3 lg:flex lg:max-w-[820px] lg:flex-nowrap lg:gap-3">
      <div className="ph-condensed flex h-[62px] w-[146px] items-center gap-3 rounded-[8px] border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[11px] leading-tight text-[#303030] shadow-[2px_3px_0_rgba(0,0,0,0.22)] lg:h-[56px] lg:w-[156px] lg:gap-3 lg:px-3 lg:text-[10px]">
        <DeliveryTruckIcon />
        <span>
          servicio a domicilio
          <br />a nivel nacional
        </span>
      </div>
      <div className="ph-condensed flex h-[62px] w-[146px] items-center gap-3 rounded-[8px] border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[11px] leading-tight text-[#303030] shadow-[2px_3px_0_rgba(0,0,0,0.22)] lg:h-[56px] lg:w-[190px] lg:gap-3 lg:px-3 lg:text-[10px]">
        <SecureLockIcon />
        <span>
          pago seguro con SSL.
          <br />
          Bancolombia, Nequi, PSE
        </span>
      </div>
      <Link
        href="/envios"
        className="ph-condensed col-span-2 mx-auto inline-flex h-[24px] min-w-[206px] items-center justify-center rounded-full border-2 border-[#1e3a8a] bg-white px-4 text-[9px] font-bold text-[#6b7280] shadow-[2px_3px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 lg:h-[28px] lg:min-w-[285px] lg:text-[10px]"
      >
        Ver costos de envío y tiempos de entrega
      </Link>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  compact = false,
}: {
  title: string;
  subtitle: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="text-center">
      <h2
        className={
          "ph-display uppercase leading-none text-[#1e3a8a] " +
          (compact ? "text-[26px] lg:text-[30px]" : "text-[29px] lg:text-[32px]")
        }
      >
        {title}
      </h2>
      <div
        className={
          "ph-condensed mt-2 font-bold leading-tight text-[#6b7280] " +
          (compact ? "text-[17px] lg:text-[18px]" : "text-[22px] lg:text-[22px]")
        }
      >
        {subtitle}
      </div>
    </div>
  );
}

function BuyButton({ item }: { item: CatalogItem }) {
  return (
    <AddToCartButton
      slug={item.slug}
      mode="cart"
      label="comprar ahora"
      showFeedback={false}
      className="ph-condensed mt-2 h-[26px] w-[104px] px-2 py-0 text-[9px] font-bold lg:h-[28px] lg:w-[118px] lg:text-[10px]"
    />
  );
}

function ProductCard({
  item,
  featured = false,
  className = "",
}: {
  item: CatalogItem;
  featured?: boolean;
  className?: string;
}) {
  const imageBoxClass = featured
    ? "h-[180px] lg:h-[178px]"
    : "h-[138px] lg:h-[148px]";

  return (
    <article
      className={`ph-condensed flex min-w-0 flex-col items-center text-center ${className}`}
    >
      <div
        className={`flex w-full items-center justify-center overflow-visible ${imageBoxClass}`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            width={380}
            height={500}
            className={`w-auto object-contain ${item.imageClassName ?? "h-full"}`}
          />
        ) : (
          <ProductVisual
            visualKey={item.visualKey}
            className={`w-auto ${item.imageClassName ?? "h-full"}`}
          />
        )}
      </div>
      <div className="mt-2 flex min-h-[54px] flex-col items-center lg:min-h-[48px]">
        <div className="flex items-baseline justify-center gap-1">
          {item.previousPrice && (
            <span className="text-[10px] font-bold leading-none text-[#ef4444] line-through lg:text-[9px]">
              {item.previousPrice}
            </span>
          )}
          <p className="text-[17px] font-bold leading-none text-[#1e3a8a] lg:text-[12px]">
            {item.price}
          </p>
        </div>
        <p className="mt-2 max-w-[92px] whitespace-pre-line text-[11px] font-bold leading-[1.05] text-[#6b7280] lg:max-w-[104px] lg:text-[9px]">
          {item.name}
        </p>
      </div>
      <BuyButton item={item} />
    </article>
  );
}

async function FeaturedProducts() {
  const FEATURED_PRODUCTS = await withDbPrices(FEATURED_PRODUCTS_STATIC);
  return (
    <section>
      <div className="lg:hidden">
        <SectionHeader
          title="Productos destacados"
          subtitle={<span className="whitespace-nowrap">Ahorra más, disfruta más cada día</span>}
        />
        <div className="mt-6 grid grid-cols-3 items-end gap-x-5">
          {[FEATURED_PRODUCTS[0], FEATURED_PRODUCTS[1], FEATURED_PRODUCTS[3]].map((item) => (
            <ProductCard key={item.name} item={item} featured />
          ))}
        </div>
      </div>

      <div className="relative hidden rounded-[26px] border border-[#d7d7d7] bg-white px-7 pb-5 pt-4 shadow-[4px_7px_18px_rgba(0,0,0,0.18)] lg:block">
        <div className="absolute left-[245px] top-4 z-10">
          <h2 className="ph-display text-[25px] uppercase leading-none text-[#1e3a8a]">
            Presentaciones destacadas:
          </h2>
          <p className="ph-condensed mt-1 text-[17px] font-bold leading-none text-[#6b7280]">
            Ahorra más, disfruta más cada día
          </p>
        </div>
        <div className="grid grid-cols-4 items-end gap-x-8 pt-8">
          {FEATURED_PRODUCTS.map((item) => (
            <ProductCard key={item.name} item={item} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

async function PetProducts() {
  const PET_PRODUCTS = await withDbPrices(PET_PRODUCTS_STATIC);
  return (
    <section className="pt-12 lg:pt-12">
      <div className="lg:hidden">
        <SectionHeader
          title="Presentaciones en PET"
          subtitle={
            <>
              Llévalas donde vayas, prácticas,
              <br />
              seguras y libre de BPA
            </>
          }
        />
        <div className="mt-8 grid grid-cols-3 gap-x-5 gap-y-10">
          {PET_PRODUCTS.slice(0, 6).map((item) => (
            <ProductCard
              key={item.name}
              item={item}
            />
          ))}
          <div className="col-span-3 mx-auto grid w-[220px] grid-cols-2 gap-x-5">
            {PET_PRODUCTS.slice(6).map((item) => (
              <ProductCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 lg:items-start lg:gap-x-10 lg:gap-y-11">
        {PET_PRODUCTS.slice(0, 3).map((item) => (
          <ProductCard key={item.name} item={item} />
        ))}
        <div className="pt-8">
          <SectionHeader
            title="Presentaciones en PET"
            subtitle={
              <>
                Llévalas donde vayas,
                <br />
                prácticas, seguras
                <br />y <span className="text-[#1e3a8a]">libre de BPA</span>
              </>
            }
            compact
          />
        </div>
        {PET_PRODUCTS.slice(3).map((item) => (
          <ProductCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}

async function LowerCatalogSections() {
  const LOWER_SECTIONS = await Promise.all(
    LOWER_SECTIONS_STATIC.map(async (section) => ({
      ...section,
      products: await withDbPrices(section.products),
    })),
  );

  return (
    <div className="grid gap-12 pt-12 lg:grid-cols-2 lg:gap-14 lg:pt-14">
      {LOWER_SECTIONS.map((section) => (
        <section key={section.id} id={section.id}>
          <SectionHeader
            title={section.title}
            subtitle={section.subtitle}
            compact
          />
          <div className="mt-8 grid grid-cols-2 gap-x-7 lg:gap-x-9">
            {section.products.map((item) => (
              <ProductCard key={item.name} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Slugs que ya tienen un slot curado arriba (con foto y layout propios). */
function curatedSlugs(): Set<string> {
  return new Set([
    ...FEATURED_PRODUCTS_STATIC.map((p) => p.slug),
    ...PET_PRODUCTS_STATIC.map((p) => p.slug),
    ...LOWER_SECTIONS_STATIC.flatMap((s) => s.products.map((p) => p.slug)),
  ]);
}

/**
 * Todo lo que está en la DB y no tiene slot curado.
 *
 * Sin esto, un producto creado en el admin no aparecía en ninguna parte de la
 * tienda: la página sólo pintaba los slugs escritos en el código. Los slots de
 * arriba se mantienen porque guardan diseño (orden e imágenes propias) que la
 * tabla `products` no tiene; el resto se arma solo desde la DB usando su
 * `visualKey` como ilustración — igual que ya hacen las presentaciones PET,
 * que tampoco tienen foto.
 */
async function CatalogFromDb() {
  let items: CatalogItem[];
  try {
    const { items: dbProducts } = await productRepo.list({ perPage: 500 });
    const curated = curatedSlugs();
    items = dbProducts
      .filter((p) => !curated.has(p.slug))
      .map((p) => ({
        name: p.title,
        price: formatCOP(p.priceValue),
        previousPrice: p.prevPriceValue
          ? formatCOP(p.prevPriceValue)
          : undefined,
        visualKey: p.visualKey,
        imageClassName: "h-[126px] lg:h-[134px]",
        slug: p.slug,
      }));
  } catch (error) {
    console.error("[productos] no se pudo leer el catálogo de la DB:", error);
    return null;
  }

  if (items.length === 0) return null;

  return (
    <section id="catalogo" className="pt-12 lg:pt-14">
      <SectionHeader
        title="Todo el catálogo"
        subtitle="Nuestra línea completa de hidratación PH PLUS"
      />
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 lg:gap-x-7">
        {items.map((item) => (
          <ProductCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}

function PerfectPresentationCard() {
  return (
    <section className="mx-auto mt-14 hidden max-w-[610px] rounded-[18px] bg-[#1e3a8a] px-8 py-6 text-center text-white shadow-[3px_5px_0_rgba(0,0,0,0.25)] lg:block">
      <h2 className="ph-condensed text-[31px] font-bold leading-tight">
        ¡Descubre la presentación perfecta para ti!
      </h2>
      <p className="ph-condensed mt-4 text-[17px] leading-relaxed opacity-90">
        Cada estilo de vida es diferente, cada rutina es única.
        <br />
        Te ayudamos a encontrar tu presentación ideal.
      </p>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 pb-10 pt-1 text-center lg:pt-10">
      <h2 className="ph-condensed mx-auto max-w-[640px] text-[24px] font-bold leading-tight text-[#1e3a8a] lg:text-[30px]">
        Miles de familias ya nos eligieron.
        <br />
        ¿Cuándo te toca a ti?
      </h2>
      <p className="ph-condensed mt-7 text-[14px] font-bold text-[#6b7280] lg:text-[17px]">
        Compra fácil por WhatsApp y recíbelo en casa.
      </p>
      <div className="mt-4 flex justify-center">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="ph-condensed inline-flex h-[34px] items-center gap-2 rounded-full bg-[#2f8a5a] px-4 text-[12px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.35)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] lg:h-[42px] lg:px-6 lg:text-[16px]"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={26}
            height={26}
            className="h-6 w-6"
          />
          Comprar por whatsapp
        </a>
      </div>
      <p className="ph-condensed mt-5 text-[14px] font-bold text-[#6b7280] lg:text-[16px]">
        Respuesta rápida • Entrega a domicilio
      </p>
    </section>
  );
}

/**
 * Reemplaza los precios del código por los de la DB (fuente de verdad).
 *
 * Los arrays de esta página definen el LAYOUT (orden, imágenes, visualKey), que
 * la tabla `products` no tiene — por eso siguen acá. Pero el precio no puede
 * salir de un string hardcodeado: divergía de la DB apenas alguien lo editaba
 * en el admin (p. ej. `recarga-19lts-individual` mostraba $50.000 cuando la DB
 * ya decía $36.000), y el checkout cobra desde la DB. Se pisan sólo los slugs
 * que existen en la DB; el resto conserva el valor del código.
 */
async function withDbPrices(items: CatalogItem[]): Promise<CatalogItem[]> {
  let bySlug: Map<string, { priceValue: number; prevPriceValue?: number }>;
  try {
    const { items: dbProducts } = await productRepo.list({ perPage: 500 });
    bySlug = new Map(
      dbProducts.map((p) => [
        p.slug,
        { priceValue: p.priceValue, prevPriceValue: p.prevPriceValue },
      ]),
    );
  } catch (error) {
    // Preferimos servir la página con los precios del código antes que tirar
    // un 500, pero dejamos rastro: los precios pueden estar desactualizados.
    console.error("[productos] no se pudieron leer precios de la DB:", error);
    return items;
  }

  return items.map((item) => {
    const db = bySlug.get(item.slug);
    if (!db) return item;
    return {
      ...item,
      price: formatCOP(db.priceValue),
      previousPrice: db.prevPriceValue
        ? formatCOP(db.prevPriceValue)
        : undefined,
    };
  });
}

export default function ProductsListingPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <TrustStrip />

        <section className="mx-auto max-w-[390px] px-[35px] pb-10 pt-8 lg:max-w-[790px] lg:px-6 lg:pt-3">
          <FeaturedProducts />
          <PetProducts />
          <LowerCatalogSections />
          <CatalogFromDb />
          <PerfectPresentationCard />
        </section>

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
