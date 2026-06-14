import Image from "next/image";
import type { ReactNode } from "react";

type TrustCard = {
  body: string;
  icon?: string;
  alt: string;
  customIcon?: ReactNode;
  iconClassName?: string;
};

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-11 w-11 text-black"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="3" />
      <path
        d="M17 25h25v18H17V25zM42 31h7l5 6v6H42V31z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="45" r="3.5" fill="currentColor" />
      <circle cx="48" cy="45" r="3.5" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1e3a8a]">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#00a8d8] text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
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
    <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-black bg-white text-[8px] font-black leading-[0.85] text-black">
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
    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#38bed0] text-white">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2S5 9.7 5 14.2A7 7 0 0012 21a7 7 0 007-6.8C19 9.7 12 2 12 2z" />
      </svg>
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
    <div className="flex min-h-9 items-center gap-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center">{icon}</span>
      <p className="ph-condensed text-[16px] font-light leading-tight text-black">
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
    customIcon: <TruckIcon />,
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
        <div className="mx-auto flex max-w-[350px] flex-col gap-1.5 lg:hidden">
          <MobileBenefit icon={<ShieldIcon />}>
            Con{" "}
            <span className="font-bold text-[#1e3a8a]">
              Calcio y MAgensio
            </span>{" "}
            para tu bienestar
          </MobileBenefit>
          <MobileBenefit icon={<BpaIcon />}>
            <span className="font-bold text-[#1e3a8a]">Libre de BPA,</span>{" "}
            envase 100% seguro
          </MobileBenefit>
          <MobileBenefit icon={<WaterDropIcon />}>
            + 14 procesos de filtración
          </MobileBenefit>
          <MobileBenefit icon={<TruckIcon />}>
            <span className="font-bold text-[#1e3a8a]">
              servicio a domicilio
            </span>
          </MobileBenefit>
        </div>

        <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-5">
          {CARDS.map((card) => (
            <div key={card.body}>
              <article className="flex h-[88px] items-center overflow-hidden rounded-[10px] border border-[#dadada] bg-[#f7f7f7] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
