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
  { value: "+1800", label: "familias han creído en nosotros" },
  { value: "+1000", label: "puntos de venta" },
];

function Drop() {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="mt-0.5 shrink-0"
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
    <section id="inicio" className="w-full bg-brand">
      <div className="relative h-[440px] w-full overflow-hidden sm:h-[500px] lg:h-[600px] xl:h-[640px]">
        <Image
          src="/hero/hero.png"
          alt="Mujer hidratándose con agua PH PLUS al aire libre"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_center] sm:object-[70%_center] lg:object-center"
        />

        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(27,34,166,0.85) 0%, rgba(27,34,166,0.55) 45%, rgba(27,34,166,0.15) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(27,34,166,0.85) 0%, rgba(27,34,166,0.55) 38%, rgba(27,34,166,0) 60%)",
          }}
        />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-page items-center px-5 sm:px-8 lg:px-12">
            <Reveal className="max-w-[600px] text-white">
              <h1 className="text-[28px] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] sm:text-[34px] lg:text-[42px]">
                Hidratación consciente
                <br />
                para ti y los tuyos
              </h1>

              <ul className="mt-6 flex flex-col gap-2.5 text-[13px] font-medium sm:mt-8 sm:gap-3 sm:text-[14px]">
                {BULLETS.map((b, i) => (
                  <Reveal key={b} as="li" delay={120 + i * 90}>
                    <span className="flex items-start gap-3">
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

      <div className="w-full bg-brand-dark text-white">
        <div className="grid w-full grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 120}
              className="flex flex-col items-center justify-center gap-1 px-4 py-5 text-center sm:flex-row sm:items-baseline sm:gap-3 sm:py-7 lg:py-8"
            >
              <span className="text-[28px] font-extrabold leading-none sm:text-[32px] lg:text-[36px]">
                {s.value}
              </span>
              <span className="text-[13px] opacity-95 sm:text-[14px] lg:text-[15px]">
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
