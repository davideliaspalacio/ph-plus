import Image from "next/image";
import Reveal from "./Reveal";

type Card = {
  body: string;
  icon: React.ReactNode;
};

function IconSeal() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
      <circle cx="32" cy="32" r="22" fill="#fff7d6" stroke="#e6c34a" strokeWidth="2" />
      <path
        d="M32 14l4.5 9.1 10.1 1.5-7.3 7.1 1.7 10-9-4.7-9 4.7 1.7-10-7.3-7.1 10.1-1.5z"
        fill="#f6c84a"
        stroke="#b78a13"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
      <path
        d="M32 6l3.4 5.1 6 .9 1 6 4.6 4-3.3 5.2 2.3 5.7-5.3 3-1 6-5.9 1.3L32 56l-1.8-6.8-5.9-1.3-1-6-5.3-3 2.3-5.7L17 28l4.6-4 1-6 6-.9z"
        fill="#6b6f7a"
      />
      <circle cx="32" cy="32" r="7" fill="#fff" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
      <rect x="6" y="22" width="30" height="22" rx="3" fill="#1b22a6" />
      <path d="M36 28h12l8 8v8H36z" fill="#3a45c9" />
      <circle cx="18" cy="48" r="5" fill="#222" />
      <circle cx="46" cy="48" r="5" fill="#222" />
      <circle cx="18" cy="48" r="2" fill="#aaa" />
      <circle cx="46" cy="48" r="2" fill="#aaa" />
    </svg>
  );
}

function IconInvima() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-md bg-white sm:h-12 sm:w-12">
      <span className="text-[10px] font-extrabold leading-none tracking-tight text-brand sm:text-[11px]">
        invima
      </span>
    </div>
  );
}

function IconBall() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
      <circle cx="32" cy="32" r="22" fill="#dff05a" stroke="#9bbd2a" strokeWidth="1.5" />
      <path
        d="M14 24c10 4 26 4 36 0M14 40c10-4 26-4 36 0"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-md border-2 border-brand sm:h-12 sm:w-12">
      <svg viewBox="0 0 32 40" className="h-7 w-6 sm:h-8 sm:w-7" aria-hidden>
        <path
          d="M16 1C8.8 1 3 6.8 3 14c0 9 13 24 13 24s13-15 13-24c0-7.2-5.8-13-13-13z"
          fill="#e23b3b"
          stroke="#a01e1e"
          strokeWidth="1"
        />
        <circle cx="16" cy="14" r="4.5" fill="#ffffff" />
      </svg>
    </div>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
      <rect x="14" y="28" width="36" height="26" rx="3" fill="#f5c14a" stroke="#b58418" strokeWidth="1.5" />
      <path
        d="M20 28v-6a12 12 0 0124 0v6"
        fill="none"
        stroke="#b58418"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="41" r="3.5" fill="#7a5a13" />
    </svg>
  );
}

const CARDS: Card[] = [
  {
    body: "Desde 2014 contigo y +1800 familias han confiado en nosotros",
    icon: (
      <Image
        src="/icons/casa.png"
        alt=""
        width={56}
        height={56}
        className="h-10 w-10 object-contain sm:h-12 sm:w-12"
      />
    ),
  },
  { body: "sello compra lo nuestro", icon: <IconSeal /> },
  { body: "+14 procesos de filtración\nCalidad en cada etapa", icon: <IconGear /> },
  { body: "servicio a domicilio a nivel nacional", icon: <IconTruck /> },
  {
    body: "Registro sanitario INVIMA\nRSA: 0030646-2024\nRSA-0024829-2023",
    icon: <IconInvima />,
  },
  { body: "PH PLUS + FCT (Federación Colombiana de Tenis)", icon: <IconBall /> },
  {
    body: "Amplia red de distribución nacional\n1000 puntos de venta y +250 aliados comerciales",
    icon: <IconPin />,
  },
  { body: "pago seguro con STL Bancolombia, Nequi, PU", icon: <IconLock /> },
];

export default function WhyPhPlus() {
  return (
    <section id="por-que" className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="text-center text-[22px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[26px] lg:text-[28px]">
            Por qué PH PLUS
          </h2>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-[1180px] grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={i} delay={80 + i * 70}>
              <article className="flex h-full items-center gap-4 rounded-xl border border-card-border bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_6px_18px_rgba(27,34,166,0.08)] sm:px-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center sm:h-14 sm:w-14">
                  {c.icon}
                </div>
                <p className="whitespace-pre-line text-[12px] leading-[1.35] text-ink sm:text-[12.5px]">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
