import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

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
    <section id="por-que" className="w-full bg-white py-8 lg:py-9">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-5">
          {CARDS.map((card, i) => (
            <Reveal key={card.body} delay={60 + i * 45}>
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
