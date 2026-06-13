import Image from "next/image";
import Reveal from "./Reveal";

const BULLETS = [
  "PH 9 que equilibra tu cuerpo",
  "Hidratación más rápida y efectiva",
  "Con calcio y magnesio para tu bienestar",
  "Libre de BPA, segura para tu salud",
];

const STATS = [
  { value: "+10", label: "años en el mercado" },
  { value: "MILES", label: "de familias han creído en nosotros" },
  { value: "+1000", label: "puntos de venta" },
];

function Drop() {
  return (
    <svg
      width="18"
      height="24"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="mt-1 shrink-0"
    >
      <path
        d="M7 1C7 1 1 7.5 1 11.5C1 14.5376 3.46243 17 6.5 17H7.5C10.5376 17 13 14.5376 13 11.5C13 7.5 7 1 7 1Z"
        fill="#7fc7df"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="w-full bg-white">
      <div className="relative h-[440px] w-full overflow-hidden bg-[#1e3a8a] sm:h-[520px] lg:h-[560px]">
        <Image
          src="/home/hero-desktop.png"
          alt="Mujer hidratándose con agua PH PLUS al aire libre"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] lg:object-[68%_center]"
        />

        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(27,34,166,0.85) 0%, rgba(27,34,166,0.55) 45%, rgba(27,34,166,0.15) 100%)",
          }}
        />
        <div className="absolute inset-y-0 left-0 hidden w-[44%] bg-linear-to-r from-black/25 to-transparent lg:block" />

        <div className="absolute inset-0">
          <div className="relative mx-auto h-full max-w-[1200px] px-5 sm:px-8 lg:px-6">
            <Reveal className="pt-20 text-white sm:pt-24 lg:absolute lg:left-6 lg:top-8 lg:max-w-[560px] lg:pt-0">
              <h1 className="ph-display text-[46px] uppercase leading-[1] sm:text-[58px] lg:text-[50px]">
                <span className="whitespace-nowrap">
                  HIDRATACIÓN{" "}
                  <span className="text-[#25f4ee]">CONSCIENTE</span>
                </span>
                <br />
                PARA TODA LA FAMILIA
                <br />
                DESDE <span className="text-[#25f4ee]">2014</span>
              </h1>

              <ul className="ph-condensed mt-8 flex max-w-[500px] flex-col gap-1 rounded-[10px] bg-black/30 px-4 py-4 text-[22px] font-bold leading-tight sm:mt-10 sm:text-[24px] lg:absolute lg:left-0 lg:top-[288px] lg:mt-0 lg:w-[460px] lg:text-[20px]">
                {BULLETS.map((b, i) => (
                  <Reveal key={b} as="li" delay={120 + i * 90}>
                    <span className="flex items-start gap-2">
                      <Drop />
                      <span>{b}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#1e3a8a] text-white">
        <div className="mx-auto grid min-h-[92px] max-w-[1200px] grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 120}
              className="flex items-center justify-center gap-3 px-4 py-5 text-center sm:py-6 lg:py-0"
            >
              <span className="ph-display whitespace-nowrap text-[32px] uppercase leading-none">
                {s.value}
              </span>
              <span className="ph-condensed whitespace-nowrap text-[24px] font-bold leading-none opacity-95">
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
