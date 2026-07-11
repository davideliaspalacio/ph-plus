import Image from "next/image";
import type { ReactNode } from "react";

type TrustCard = {
  body: string;
  icon?: string;
  alt: string;
  customIcon?: ReactNode;
  iconClassName?: string;
};

function TruckIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${className} text-black`}
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

function ShieldIcon() {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1e3a8a]">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#00a8d8] text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M12 3l7 3v5c0 4.6-2.8 8.1-7 10-4.2-1.9-7-5.4-7-10V6l7-3z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12l2.2 2.2 4.8-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

function BpaIcon() {
  return (
    <span className="relative block h-11 w-11 overflow-hidden rounded-full bg-white">
      <Image
        src="/home/icon-bpa-free.jpg"
        alt=""
        fill
        sizes="44px"
        className="object-contain"
      />
    </span>
  );
}

function GearIcon() {
  return (
    <span className="relative block h-11 w-11">
      <Image
        src="/home/icon-filtration.png"
        alt=""
        fill
        sizes="44px"
        className="object-contain"
      />
    </span>
  );
}

function MobileBenefit({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center">{icon}</span>
      <p className="ph-condensed text-[18px] font-light leading-tight text-black">
        {children}
      </p>
    </div>
  );
}

const CARDS: TrustCard[] = [
  {
    body: "Desde 2014 contigo",
    icon: "/home/icon-casa.png",
    alt: "Casa",
  },
  {
    body: "sello compra lo nuestro",
    icon: "/home/icon-sello.png",
    alt: "Sello Compra lo Nuestro",
  },
  {
    body: "+14 procesos de filtración\nCalidad en cada etapa",
    icon: "/home/icon-filtration.png",
    alt: "Procesos de filtración",
  },
  {
    body: "servicio a domicilio",
    customIcon: <TruckIcon className="h-16 w-16" />,
    alt: "Camión de entrega",
  },
  {
    body: "Registro sanitario INVIMA\nRSA: 0030646-2024\nRSA-0024829-2023",
    icon: "/home/icon-invima.png",
    alt: "INVIMA",
    iconClassName: "scale-[1.28]",
  },
  {
    body: "PH PLUS + FCT (Federación Colombiana de Tenis)",
    icon: "/home/icon-tennis.png",
    alt: "Tenis",
  },
  {
    body: "Amplia red de distribución nacional\n+1000 puntos de venta y +250 aliados comerciales",
    icon: "/home/icon-marker.png",
    alt: "Marcador de ubicación",
  },
  {
    body: "pago seguro con SSL.\nBancolombia, Nequi, PSE",
    icon: "/home/icon-lock.png",
    alt: "Pago seguro",
  },
];

export default function WhyPhPlus() {
  return (
    <section id="por-que" className="w-full bg-white py-1 lg:py-9">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-6">
        <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-3 py-5 lg:hidden">
          <MobileBenefit icon={<ShieldIcon />}>
            Con Calcio y Magnesio
          </MobileBenefit>
          <MobileBenefit icon={<GearIcon />}>
            + 14 procesos de filtración
          </MobileBenefit>
          <MobileBenefit icon={<BpaIcon />}>
            Libre de BPA
          </MobileBenefit>
          <MobileBenefit icon={<TruckIcon />}>
            servicio a domicilio
          </MobileBenefit>
        </div>

        <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-5">
          {CARDS.map((card) => (
            <div key={card.body}>
              <article className="flex h-[88px] items-center overflow-hidden rounded-[10px] border border-[#dadada] bg-[#f4f4f4] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="relative grid h-[88px] w-[88px] shrink-0 place-items-center overflow-hidden">
                  {card.customIcon ??
                    (card.icon ? (
                      <Image
                        src={card.icon}
                        alt={card.alt}
                        width={111}
                        height={111}
                        className={
                          "h-full w-full object-contain " +
                          (card.iconClassName ?? "")
                        }
                      />
                    ) : null)}
                </div>
                <p className="ph-condensed whitespace-pre-line pr-3 text-[15px] font-light leading-[1.25] text-black">
                  {card.body}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
