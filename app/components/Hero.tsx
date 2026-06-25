import Image from "next/image";

const BULLETS = [
  "PH 9 que equilibra tu cuerpo",
  "Hidratación más rápida y efectiva",
  "Con calcio y magnesio para tu bienestar",
  "Libre de BPA, segura para tu salud",
];

const STATS = [
  { value: "+12", label: "años en el mercado" },
  { value: "MILES", label: "de familias han creído en nosotros" },
  { value: "+1000", label: "puntos de venta" },
];

function Drop({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/home/ph9-drop.png"
      alt=""
      width={18}
      height={24}
      aria-hidden
      className={`mt-0.5 h-5 w-3.5 shrink-0 object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] ${className}`}
    />
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="w-full bg-white">
      <div className="lg:hidden">
        <div className="relative h-[225px] w-full overflow-hidden bg-[#1e3a8a]">
          <Image
            src="/home/hero-desktop.png"
            alt="Mujer hidratándose con agua PH PLUS al aire libre"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[56%_top]"
          />
          <div className="absolute inset-y-0 left-0 w-[58%] bg-linear-to-r from-black/35 to-transparent" />

          <div className="absolute left-[18px] top-[15px] text-white">
            <h1 className="ph-display w-[230px] text-[24px] uppercase leading-[1.1] text-white">
              HIDRATACIÓN CONSCIENTE
              <br />
              PARA TODA LA FAMILIA
              <br />
              DESDE 2014
            </h1>
          </div>

          <ul className="ph-condensed absolute bottom-[34px] left-[24px] flex w-[250px] flex-col gap-1 text-[16px] font-bold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
            {BULLETS.slice(0, 2).map((b) => (
              <li key={b}>
                <span className="flex items-start gap-2">
                  <Drop className="h-4 w-3" />
                  <span>{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-[58px] bg-[#1e2aab] text-white">
          <div className="mx-auto grid h-full max-w-[390px] grid-cols-2 items-center justify-center px-8">
            <div className="flex items-center justify-center gap-1.5">
              <span className="ph-display text-[22px] leading-none">+12</span>
              <span className="ph-condensed text-[12px] font-bold uppercase leading-none text-[#90b8ff]">
                años hidratando
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
            className="object-cover object-[58%_center]"
          />

          <div className="absolute inset-y-0 left-0 w-[44%] bg-linear-to-r from-black/25 to-transparent" />

          <div className="absolute inset-0">
            <div className="relative mx-auto h-full max-w-[1200px] px-6">
              <div className="absolute left-6 top-8 max-w-[560px] text-white">
                <h1 className="ph-display text-[50px] uppercase leading-[1] text-white">
                  <span className="whitespace-nowrap">
                    HIDRATACIÓN CONSCIENTE
                  </span>
                  <br />
                  PARA TODA LA FAMILIA
                  <br />
                  DESDE 2014
                </h1>

                <ul className="ph-condensed absolute left-0 top-[288px] flex w-[460px] flex-col gap-1 text-[20px] font-bold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
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

        <div className="w-full bg-[#1e2aab] text-white">
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
