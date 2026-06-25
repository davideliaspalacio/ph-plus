import Image from "next/image";
import Link from "next/link";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductVisual from "../components/ProductVisual";
import type { ProductVisualKey } from "../lib/products";

type CatalogItem = {
  name: string;
  price: string;
  previousPrice?: string;
  visualKey: ProductVisualKey;
  imageClassName?: string;
  slug?: string;
};

type CatalogSection = {
  id: string;
  title: string;
  subtitle: React.ReactNode;
  products: CatalogItem[];
};

const WHATSAPP_NUMBER = "573234392470";

const FEATURED_PRODUCTS: CatalogItem[] = [
  {
    name: "Promoción garrafas",
    price: "$73,470",
    previousPrice: "$122,450",
    visualKey: "garrafas",
    imageClassName: "h-[132px] lg:h-[178px]",
    slug: "promocion-garrafas",
  },
  {
    name: "Kit inicial de\nbotellón 19 lts",
    price: "$85,000",
    visualKey: "kit",
    imageClassName: "h-[108px] lg:h-[128px]",
    slug: "kit-inicial-botellon-19lts",
  },
  {
    name: "1 recarga\nde 19 lts",
    price: "$50,000",
    visualKey: "recargas",
    imageClassName: "h-[108px] lg:h-[128px]",
    slug: "recarga-19lts-individual",
  },
  {
    name: "2 recargas\ncada una de 19 lts",
    price: "$69,000",
    visualKey: "recargas",
    imageClassName: "h-[108px] lg:h-[128px]",
    slug: "recargas-19lts",
  },
];

const PET_PRODUCTS: CatalogItem[] = [
  {
    name: "agua ph plus 300\nml KIDS x 24 ud",
    price: "$57,600",
    visualKey: "garrafas",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "garrafa-1l-pack6",
  },
  {
    name: "agua ph plus 300\nml x 24 ud",
    price: "$57,600",
    visualKey: "garrafas",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "garrafa-1l-pack6",
  },
  {
    name: "agua ph plus 500\nml sport x 12 ud",
    price: "$50,160",
    visualKey: "kit",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "garrafa-1-5l-pack6",
  },
  {
    name: "agua ph plus 500\nml x 12 ud",
    price: "$48,480",
    visualKey: "kit",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "garrafa-1-5l-pack6",
  },
  {
    name: "agua ph plus FIT\n1LT x 6 ud",
    price: "$35,376",
    previousPrice: "$44,220",
    visualKey: "garrafas",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "garrafa-1l-pack6",
  },
  {
    name: "agua ph plus\n1LT x 6 ud",
    price: "$50,160",
    visualKey: "kit",
    imageClassName: "h-[126px] lg:h-[134px]",
    slug: "garrafa-1l-pack6",
  },
  {
    name: "agua ph plus 5LT x\n1ud",
    price: "$24,490",
    visualKey: "kit",
    imageClassName: "h-[132px] lg:h-[138px]",
    slug: "botellon-5l",
  },
  {
    name: "1 recarga\nde 19 lts",
    price: "$50,000",
    visualKey: "recargas",
    imageClassName: "h-[132px] lg:h-[138px]",
    slug: "recarga-19lts-individual",
  },
];

const LOWER_SECTIONS: CatalogSection[] = [
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
        slug: "botellon-19lts",
      },
      {
        name: "agua ph plus vidrio\n477 ml x 24 ud",
        price: "$132,000",
        visualKey: "kit",
        imageClassName: "h-[140px] lg:h-[148px]",
        slug: "botellon-19lts",
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
        slug: "garrafa-1l-pack6",
      },
      {
        name: "agua SABORIZADA\nph plus LIMONARIA\n500 ml x 12 ud",
        price: "$63,600",
        visualKey: "garrafas",
        imageClassName: "h-[128px] lg:h-[136px]",
        slug: "garrafa-1l-pack6",
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

function productHref(item: CatalogItem) {
  return `/productos/${item.slug ?? "promocion-garrafas"}`;
}

function TrustStrip() {
  return (
    <div className="mx-auto mt-8 grid max-w-[330px] grid-cols-2 items-center justify-center gap-3 px-4 lg:mt-3 lg:flex lg:max-w-[740px] lg:flex-nowrap lg:gap-2">
      <div className="ph-condensed flex h-[58px] w-[146px] items-center gap-3 rounded-[8px] border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[11px] leading-tight text-[#303030] shadow-[2px_3px_0_rgba(0,0,0,0.22)] lg:h-[40px] lg:w-[118px] lg:gap-2 lg:px-2 lg:text-[7px]">
        <Image
          src="/home/icon-truck.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 object-contain lg:h-5 lg:w-5"
        />
        <span>
          servicio a domicilio
          <br />a nivel nacional
        </span>
      </div>
      <div className="ph-condensed flex h-[58px] w-[146px] items-center gap-3 rounded-[8px] border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[11px] leading-tight text-[#303030] shadow-[2px_3px_0_rgba(0,0,0,0.22)] lg:h-[40px] lg:w-[138px] lg:gap-2 lg:px-2 lg:text-[7px]">
        <Image
          src="/home/icon-lock.png"
          alt=""
          width={34}
          height={34}
          className="h-8 w-8 object-contain lg:h-5 lg:w-5"
        />
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
    <Link
      href={productHref(item)}
      className="ph-condensed mt-2 inline-flex h-[19px] w-[88px] items-center justify-center gap-1 rounded-full bg-[#1e3a8a] px-2 text-[7px] font-bold text-white transition-transform hover:-translate-y-0.5 lg:h-[19px] lg:w-[92px] lg:text-[7px]"
      aria-label={`Ver detalle de ${item.name.replace(/\n/g, " ")}`}
    >
      <Image
        src="/icons/cart.svg"
        alt=""
        width={12}
        height={12}
        className="h-3 w-3"
      />
      comprar ahora
    </Link>
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
    ? "h-[142px] lg:h-[178px]"
    : "h-[138px] lg:h-[148px]";

  return (
    <article
      className={`ph-condensed flex min-w-0 flex-col items-center text-center ${className}`}
    >
      <Link
        href={productHref(item)}
        aria-label={`Ver detalle de ${item.name.replace(/\n/g, " ")}`}
        className={`flex w-full items-center justify-center overflow-visible ${imageBoxClass}`}
      >
        <ProductVisual
          visualKey={item.visualKey}
          className={`w-auto ${item.imageClassName ?? "h-full"}`}
        />
      </Link>
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
        <Link
          href={productHref(item)}
          className="mt-2 max-w-[92px] whitespace-pre-line text-[11px] font-bold leading-[1.05] text-[#6b7280] hover:text-[#1e3a8a] lg:max-w-[104px] lg:text-[9px]"
        >
          {item.name}
        </Link>
      </div>
      <BuyButton item={item} />
    </article>
  );
}

function FeaturedProducts() {
  return (
    <section>
      <div className="lg:hidden">
        <SectionHeader
          title="Productos destacados"
          subtitle="Ahorra más, disfruta más cada día"
        />
        <div className="mt-6 grid grid-cols-3 items-end gap-x-5">
          {FEATURED_PRODUCTS.slice(0, 3).map((item) => (
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

function PetProducts() {
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
          {PET_PRODUCTS.map((item, index) => (
            <ProductCard
              key={item.name}
              item={item}
              className={index === 6 ? "col-start-1" : ""}
            />
          ))}
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

function LowerCatalogSections() {
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
        Elige lo mejor para tu cuerpo.
        <br />
        Empieza a hidratarte con PH PLUS
      </h2>
      <p className="ph-condensed mt-7 text-[14px] font-bold text-[#6b7280] lg:text-[17px]">
        Compra fácil por WhatsApp y recíbelo en casa.
      </p>
      <div className="mt-4 flex justify-center">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="ph-condensed inline-flex h-[31px] items-center gap-2 rounded-full bg-[#2f8a5a] px-3 text-[10px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.35)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] lg:h-[34px] lg:px-5 lg:text-[12px]"
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
          <PerfectPresentationCard />
        </section>

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
