import Image from "next/image";

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
      <div className="lg:hidden">
        <div className="relative h-[259px] w-full overflow-hidden bg-[#1e3a8a]">
          <Image
            src="/home/hero-desktop.png"
            alt="Mujer hidratándose con agua PH PLUS al aire libre"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[56%_center]"
          />
          <div className="absolute inset-y-0 left-0 w-[58%] bg-linear-to-r from-black/35 to-transparent" />

          <div className="absolute left-[18px] top-[15px] text-white">
            <h1 className="ph-display w-[220px] text-[20px] uppercase leading-[1.22]">
              HIDRATACIÓN{" "}
              <span className="text-[28px] text-[#25f4ee]">CONSCIENTE</span>
              <br />
              PARA TODA LA FAMILIA
              <br />
              DESDE <span className="text-[#25f4ee]">2014</span>
            </h1>
          </div>

          <ul className="ph-condensed absolute bottom-[74px] left-[26px] flex w-[240px] flex-col gap-0.5 rounded-[10px] bg-black/30 px-3 py-2 text-[16px] font-bold leading-tight text-white">
            {BULLETS.slice(0, 2).map((b) => (
              <li key={b}>
                <span className="flex items-start gap-1.5">
                  <span className="mt-1 text-[11px] leading-none text-[#25f4ee]">
                    ◆
                  </span>
                  <span>{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-[58px] bg-[#1e3a8a] text-white">
          <div className="mx-auto grid h-full max-w-[390px] grid-cols-2 items-center justify-center px-8">
            <div className="flex items-center justify-center gap-1.5">
              <span className="ph-display text-[22px] leading-none">+10</span>
              <span className="ph-condensed text-[12px] font-bold uppercase leading-none text-[#90b8ff]">
                años hidratando a
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="ph-display text-[22px] leading-none">+1000</span>
              <span className="ph-condensed text-[12px] font-bold uppercase leading-none text-[#90b8ff]">
                puntos de venta
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="relative h-[560px] w-full overflow-hidden bg-[#1e3a8a]">
          <Image
            src="/home/hero-desktop.png"
            alt="Mujer hidratándose con agua PH PLUS al aire libre"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center]"
          />

          <div className="absolute inset-y-0 left-0 w-[44%] bg-linear-to-r from-black/25 to-transparent" />

          <div className="absolute inset-0">
            <div className="relative mx-auto h-full max-w-[1200px] px-6">
              <div className="absolute left-6 top-8 max-w-[560px] text-white">
                <h1 className="ph-display text-[50px] uppercase leading-[1]">
                  <span className="whitespace-nowrap">
                    HIDRATACIÓN{" "}
                    <span className="text-[#25f4ee]">CONSCIENTE</span>
                  </span>
                  <br />
                  PARA TODA LA FAMILIA
                  <br />
                  DESDE <span className="text-[#25f4ee]">2014</span>
                </h1>

                <ul className="ph-condensed absolute left-0 top-[288px] flex w-[460px] flex-col gap-1 rounded-[10px] bg-black/30 px-4 py-4 text-[20px] font-bold leading-tight">
                  {BULLETS.map((b) => (
                    <li key={b}>
                      <span className="flex items-start gap-2">
                        <Drop />
                        <span>{b}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#1e3a8a] text-white">
          <div className="mx-auto grid min-h-[92px] max-w-[1200px] grid-cols-3 divide-x divide-white/15">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-center gap-3 px-4 text-center"
              >
                <span className="ph-display whitespace-nowrap text-[32px] uppercase leading-none">
                  {s.value}
                </span>
                <span className="ph-condensed whitespace-nowrap text-[24px] font-bold leading-none opacity-95">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
