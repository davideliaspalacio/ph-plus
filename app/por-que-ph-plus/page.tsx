import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StoriesCarousel from "./StoriesCarousel";

export const metadata: Metadata = {
  title: "Por qué PH PLUS | Agua PH PLUS",
  description:
    "Conoce por qué PH PLUS ofrece hidratación consciente, procesos de filtración y testimonios reales.",
};

const TRUST_CARDS = [
  {
    icon: "/home/icon-casa.png",
    alt: "",
    text: "Desde 2014 contigo",
  },
  {
    icon: "/home/icon-sello.png",
    alt: "",
    text: "sello compra lo nuestro",
  },
  {
    icon: "/home/icon-filtration.png",
    alt: "",
    text: "+14 procesos de filtración\nCalidad en cada etapa",
  },
  {
    icon: "/home/icon-truck.png",
    alt: "",
    text: "servicio a domicilio",
  },
  {
    icon: "/home/icon-invima.png",
    alt: "",
    text: "Registro sanitario INVIMA\nRSA: 0030646-2024\nRSA-0024829-2023",
  },
  {
    icon: "/home/icon-tennis.png",
    alt: "",
    text: "PH PLUS + FCT (Federación\nColombiana de Tenis)",
  },
  {
    icon: "/home/icon-marker.png",
    alt: "",
    text: "Amplia red de distribución nacional\n+1000 puntos de venta y +250\naliados comerciales",
  },
  {
    icon: "/home/icon-lock.png",
    alt: "",
    text: "pago seguro con SSL.\nBancolombia, Nequi, PSE",
  },
];

const TOP_POINTS = [
  "PH 9 que equilibra tu cuerpo",
  "+10 años de hidratación efectiva",
  "+1000 puntos de venta",
];

const BENEFITS = [
  {
    kind: "shield",
    text: (
      <>
        Con <strong>Calcio y Magnesio</strong> para tu bienestar
      </>
    ),
  },
  {
    kind: "bpa",
    text: (
      <>
        <strong>Libre de BPA,</strong> envase 100% seguro
      </>
    ),
  },
  {
    kind: "drop",
    text: <>+ 14 procesos de filtración</>,
  },
  {
    kind: "truck",
    text: (
      <>
        <strong>servicio a domicilio</strong>
      </>
    ),
  },
];

function DropBullet() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#30c3dc]" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2S5 9.7 5 14.2A7 7 0 0012 21a7 7 0 007-6.8C19 9.7 12 2 12 2z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1e3a8a]">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#00a8d8] text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M12 3l7 3v5c0 4.6-2.8 8.1-7 10-4.2-1.9-7-5.4-7-10V6l7-3z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M8.5 12l2.2 2.2 4.8-5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
    </span>
  );
}

function BpaIcon() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-black bg-white text-[8px] font-black leading-[0.85] text-black">
      <span className="text-center">
        BPA
        <br />
        FREE
      </span>
    </span>
  );
}

function WaterDropIcon() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#38bed0] text-white">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2S5 9.7 5 14.2A7 7 0 0012 21a7 7 0 007-6.8C19 9.7 12 2 12 2z" />
      </svg>
    </span>
  );
}

function TruckIcon() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-black bg-white text-black">
      <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" aria-hidden>
        <path
          d="M8 22h31v22H8zM39 30h9l8 8v6H39z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="48" r="5" stroke="currentColor" strokeWidth="4" />
        <circle cx="48" cy="48" r="5" stroke="currentColor" strokeWidth="4" />
      </svg>
    </span>
  );
}

function BenefitIcon({ kind }: { kind: string }) {
  if (kind === "shield") return <ShieldIcon />;
  if (kind === "bpa") return <BpaIcon />;
  if (kind === "truck") return <TruckIcon />;
  return <WaterDropIcon />;
}

function PlayButton() {
  return (
    <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#f01b16] shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
      <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

function TrustCards() {
  return (
    <section className="hidden bg-white pt-6 lg:block">
      <div className="mx-auto max-w-[920px] px-6">
        <h1 className="ph-display text-center text-[32px] uppercase leading-none text-[#1e3a8a]">
          Por qué PH PLUS
        </h1>
        <div className="mt-6 grid grid-cols-4 gap-4">
          {TRUST_CARDS.map((card) => (
            <article
              key={card.text}
              className="flex h-[66px] items-center rounded-[8px] border border-[#dadada] bg-[#f7f7f7] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <Image
                src={card.icon}
                alt={card.alt}
                width={48}
                height={48}
                className="h-10 w-10 shrink-0 object-contain"
              />
              <p className="ph-condensed ml-3 whitespace-pre-line text-[12px] leading-tight text-[#303030]">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileIntro() {
  return (
    <section className="bg-white px-7 pb-7 pt-5 lg:hidden">
      <h1 className="ph-display text-center text-[28px] uppercase leading-none text-[#1e3a8a]">
        Por qué PH PLUS
      </h1>

      <div className="mx-auto mt-5 max-w-[320px] rounded-[10px] bg-white px-5 py-4 shadow-[5px_6px_8px_rgba(0,0,0,0.28)]">
        <ul className="space-y-2">
          {TOP_POINTS.map((point) => {
            const [lead, ...rest] = point.split(" ");
            return (
              <li
                key={point}
                className="ph-condensed flex items-center gap-5 text-[18px] leading-none text-[#222]"
              >
                <DropBullet />
                <span>
                  <strong className="text-[#1e3a8a]">{lead}</strong>{" "}
                  {rest.join(" ")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto mt-7 flex max-w-[320px] flex-col gap-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.kind} className="flex items-center gap-5">
            <BenefitIcon kind={benefit.kind} />
            <p className="ph-condensed text-[17px] font-light leading-tight text-black [&_strong]:font-bold [&_strong]:text-[#1e3a8a]">
              {benefit.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section className="bg-white px-6 py-8 lg:py-16">
      <div className="mx-auto grid max-w-[920px] gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
        <div className="hidden lg:block">
          <button
            type="button"
            className="relative block overflow-hidden border-[4px] border-[#8a5cf6] bg-white"
            aria-label="Reproducir demostración sobre pH"
          >
            <Image
              src="/about/ph-demo-video.png"
              alt="Demostración práctica del pH del agua"
              width={324}
              height={192}
              className="h-auto w-full"
            />
            <PlayButton />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_101px] items-center gap-4 lg:block">
          <h2 className="ph-condensed text-center text-[26px] font-bold leading-tight text-[#1e3a8a] lg:text-left lg:text-[24px]">
            ¿Por qué el pH del agua es tan importante?
          </h2>
          <Image
            src="/about/ph-test-mobile.png"
            alt="Prueba de pH del agua"
            width={101}
            height={169}
            className="h-[169px] w-[101px] object-cover lg:hidden"
          />
          <p className="ph-condensed mt-5 hidden text-[17px] font-bold leading-tight text-[#1e3a8a] lg:block">
            A través de una demostración práctica, el Dr. Hugo Mario Galindo
            con más de 30 años de experiencia en medicina preventiva y
            ortomolecular, te muestra cómo se mide la alcalinidad del agua y qué
            significa esto para tu día a día.
          </p>
        </div>

        <div>
          <h2 className="ph-condensed text-center text-[25px] font-bold leading-tight text-[#1e3a8a] lg:text-left lg:text-[24px] lg:text-[#6b7280]">
            ¿Quieres conocer los procesos de PH PLUS?
          </h2>
          <p className="ph-condensed mt-5 hidden text-[17px] font-bold leading-tight text-[#1e3a8a] lg:block">
            Este video te muestra el proceso de producción de PH PLUS, donde
            combinamos tecnología avanzada y controles rigurosos para obtener
            un agua con pH 9 de alta pureza y alcalinidad.
          </p>
        </div>

        <div className="mx-auto w-[189px] lg:mx-0 lg:w-[340px]">
          <Image
            src="/about/filtration-process.png"
            alt="Proceso de filtración de PH PLUS"
            width={340}
            height={202}
            className="h-auto w-full border-4 border-white object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
          />
        </div>
      </div>
    </section>
  );
}

function PageCta() {
  return (
    <section className="bg-white px-5 pb-10 pt-2 text-center lg:pb-12">
      <h2 className="ph-condensed mx-auto max-w-[720px] text-[29px] font-bold leading-tight text-[#1e3a8a] lg:text-[36px]">
        Únete a miles de personas que ya eligieron mejor
      </h2>
      <p className="ph-condensed mt-4 text-[14px] font-bold text-[#6b7280] lg:text-[22px]">
        Compra fácil por WhatsApp y recíbelo en casa.
      </p>
      <div className="mt-6 flex justify-center">
        <a
          href="https://wa.me/573234392470"
          target="_blank"
          rel="noopener noreferrer"
          className="ph-condensed inline-flex h-[30px] items-center gap-2 rounded-full bg-[#2f6b4f] px-3 text-[10px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.45)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] lg:h-[48px] lg:px-7 lg:text-[18px]"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={28}
            height={28}
            className="h-6 w-6 lg:h-8 lg:w-8"
          />
          Comprar por whatsapp
        </a>
      </div>
      <p className="ph-condensed mt-6 text-[14px] font-bold text-[#6b7280] lg:text-[18px]">
        Respuesta rápida • Entrega a domicilio
      </p>
    </section>
  );
}

export default function PorQuePhPlusPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <TrustCards />
        <MobileIntro />
        <EducationSection />
        <StoriesCarousel />
        <PageCta />
      </main>
      <Footer />
    </>
  );
}
