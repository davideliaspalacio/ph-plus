"use client";

import Image from "next/image";
import { useState } from "react";

const STORIES = [
  {
    name: "Sirley Montoya",
    image: "/testimonial/sirley-drop.png",
    video: "/videos/testimonio-sirley.mp4",
    alt: "Sirley Montoya con agua PH PLUS",
    quote:
      "Durante mi proceso oncológico no toleraba el agua tradicional. Con PH PLUS todo cambió: puedo hidratarme con gusto y eso ha sido clave en mi recuperación.",
    imageMode: "drop",
    tone: "blue",
  },
  {
    headline: "Un aliado clave en mi entrenamiento.",
    name: "Camilo Díaz",
    image: "/about/testimonial-camilo.png",
    alt: "Camilo Díaz",
    quote:
      "La hidratación es fundamental para construir músculo, y esta agua me ayuda a equilibrar la acidez que genera tanto la dieta estricta como los entrenamientos intensos. Tomo 5 litros diarios y los resultados hablan por sí solos.",
    imageMode: "photo",
    tone: "cyan",
  },
  {
    headline: "La pruebas una vez y no vuelves a la normalidad.",
    name: "Dra Martha Liliana López",
    image: "/about/testimonial-martha.png",
    alt: "Dra Martha Liliana López",
    quote:
      "Y no es solo para hidratarse: va increíble como tónico facial para una piel radiante, y aplicada en el cabello después del lavado. Además, elimina metales pesados, reduce la acidez del cuerpo sin necesidad de agregarle nada.",
    imageMode: "photo",
    tone: "blue",
  },
  {
    headline: "El agua que cuida tu salud desde adentro.",
    name: "Daniel Rojas",
    image: "/about/testimonial-daniel.png",
    alt: "Daniel Rojas",
    quote:
      "Los cuerpos ácidos son terreno fértil para enfermedades, y consumir agua alcalina es una forma sencilla y natural de contrarrestar eso. Además, tiene sabores como limonaria sin saborizantes artificiales, 100% naturales y que mantienen el pH alcalino.",
    imageMode: "photo",
    tone: "aqua",
  },
];

const INFLUENCER_STORIES = STORIES.slice(1);
const DROP_CLIP_PATH =
  "polygon(50% 0%, 74% 17%, 91% 42%, 88% 70%, 68% 94%, 50% 100%, 28% 93%, 10% 70%, 8% 42%, 26% 17%)";

function IdentifyBadge({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ph-condensed inline-flex h-7 items-center gap-1.5 rounded-full border-2 border-[#1e3a8a] bg-white px-3 text-[10px] font-bold uppercase leading-none text-[#6b7280]"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#f43f5e] text-white">
        ♥
      </span>
      Me identifico
    </button>
  );
}

function toneClass(tone: string) {
  if (tone === "aqua") {
    return "bg-linear-to-br from-[#48d8e5] via-[#0f7fcc] to-[#1e3a8a]";
  }
  if (tone === "cyan") {
    return "bg-linear-to-br from-[#34d1df] via-[#0e93d6] to-[#1e3a8a]";
  }
  return "bg-[#1e3a8a]";
}

export default function StoriesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState(() => STORIES.map(() => 100));
  const active = STORIES[activeIndex];

  function nextStory() {
    setActiveIndex((current) => (current + 1) % STORIES.length);
  }

  function identifyWithStory(index: number) {
    setCounts((current) =>
      current.map((count, itemIndex) => (itemIndex === index ? count + 1 : count)),
    );
  }

  return (
    <section className="bg-white px-5 pb-9 pt-5 lg:pb-12 lg:pt-4">
      <div className="mx-auto max-w-[920px]">
        <h2 className="ph-display text-center text-[28px] uppercase leading-none text-[#1e3a8a] lg:text-[36px]">
          Gotas que cuentan historias
        </h2>
        <p className="ph-condensed mt-2 text-center text-[17px] font-bold leading-tight text-[#6b7280] lg:text-[22px]">
          Cuando más lo necesitaba, PH PLUS estaba ahí.
        </p>

        <div
          aria-live="polite"
          className="mx-auto mt-5 grid max-w-[360px] grid-cols-[119px_1fr_34px] items-center gap-3 lg:max-w-[660px] lg:grid-cols-[180px_1fr_42px] lg:gap-6"
        >
          <div
            className={
              active.imageMode === "drop"
                ? "relative h-[145px] w-[119px] overflow-hidden rounded-[48%] bg-[#eef0ff] lg:h-[210px] lg:w-[170px]"
                : "relative h-[120px] w-[96px] justify-self-center lg:h-[170px] lg:w-[135px]"
            }
          >
            {"video" in active && active.video ? (
              <video
                className="h-full w-full object-cover"
                src={active.video}
                controls
                playsInline
                preload="metadata"
                aria-label={`Video testimonial de ${active.name}`}
              />
            ) : (
              <Image
                src={active.image}
                alt={active.alt}
                fill
                sizes="(min-width: 1024px) 170px, 119px"
                className={
                  active.imageMode === "drop"
                    ? "object-contain"
                    : "object-cover object-top"
                }
                style={
                  active.imageMode === "drop"
                    ? undefined
                    : { clipPath: DROP_CLIP_PATH }
                }
              />
            )}
          </div>
          <article
            className="ph-condensed rounded-[20px] bg-[#1e3a8a] px-3 py-4 text-white lg:px-5 lg:py-5"
          >
            <p className="text-[12px] font-bold leading-[1.25] lg:text-[18px]">
              {active.quote}
            </p>
            <p className="mt-4 text-right text-[12px] font-bold lg:text-[18px]">
              {active.name}
            </p>
          </article>
          <button
            type="button"
            onClick={nextStory}
            className="grid h-8 w-8 place-items-center rounded-full border-2 border-black text-[22px] leading-none text-black transition-transform hover:scale-105 lg:h-10 lg:w-10 lg:text-[26px]"
            aria-label="Ver siguiente historia"
          >
            →
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-5 lg:justify-end lg:pr-[240px]">
          <span className="ph-condensed text-[24px] font-bold leading-none text-[#6b7280]">
            {counts[activeIndex]}
          </span>
          <IdentifyBadge onClick={() => identifyWithStory(activeIndex)} />
        </div>

        <div className="mt-8 hidden grid-cols-3 gap-8 lg:grid">
          {INFLUENCER_STORIES.map((item, index) => (
            <div key={item.name}>
              <div className="text-center">
                <p className="ph-condensed mx-auto flex min-h-[42px] max-w-[230px] items-center justify-center text-[18px] font-bold leading-tight text-[#6b7280]">
                  {item.headline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(index + 1)}
                className={
                  "ph-condensed mt-5 flex min-h-[330px] w-full flex-col rounded-[12px] px-4 py-4 text-left text-white shadow-[10px_10px_0_#bdd6fb] transition-transform hover:-translate-y-1 " +
                  toneClass(item.tone)
                }
              >
                <span className="grid grid-cols-[92px_1fr] items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={92}
                    height={116}
                    className="h-[136px] w-[88px] object-cover object-top"
                    style={{ clipPath: DROP_CLIP_PATH }}
                  />
                  <span className="text-[17px] font-bold leading-tight">
                    {item.name}
                  </span>
                </span>
                <span className="mt-5 text-[15px] font-bold leading-[1.28]">
                  {item.quote}
                </span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="ph-condensed text-[24px] font-bold leading-none text-[#6b7280]">
                  {counts[index + 1]}
                </span>
                <IdentifyBadge onClick={() => identifyWithStory(index + 1)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
