"use client";

import Image from "next/image";
import { useState } from "react";

const STORIES = [
  {
    name: "Sirley Montoya",
    image: "/testimonial/sirley-drop-real.jpeg",
    alt: "Sirley Montoya con agua PH PLUS",
    quote:
      "Durante mi proceso oncológico no toleraba el agua tradicional. Con PH PLUS todo cambió: puedo hidratarme con gusto y eso ha sido clave en mi recuperación.",
  },
  {
    name: "Camilo Díaz",
    image: "/about/drop-camilo.png",
    alt: "Camilo Díaz",
    quote:
      "La hidratación es fundamental para construir músculo, y esta agua me ayuda a equilibrar la acidez que genera tanto la dieta estricta como los entrenamientos intensos. Tomo 5 litros diarios y los resultados hablan por sí solos.",
  },
  {
    name: "Dra Martha Liliana López",
    image: "/about/drop-liliana.png",
    alt: "Dra Martha Liliana López",
    quote:
      "Y no es solo para hidratarse: va increíble como tónico facial para una piel radiante, y aplicada en el cabello después del lavado. Además, elimina metales pesados, reduce la acidez del cuerpo sin necesidad de agregarle nada.",
  },
  {
    name: "Daniel Rojas",
    image: "/about/drop-daniel.png",
    alt: "Daniel Rojas",
    quote:
      "Los cuerpos ácidos son terreno fértil para enfermedades, y consumir agua alcalina es una forma sencilla y natural de contrarrestar eso. Además, tiene sabores como limonaria sin saborizantes artificiales, 100% naturales y que mantienen el pH alcalino.",
  },
];

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

export default function StoriesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState(() => STORIES.map(() => 100));
  const activeStory = STORIES[activeIndex];

  function showNextStory() {
    setActiveIndex((current) => (current + 1) % STORIES.length);
  }

  function identifyWithStory() {
    setCounts((currentCounts) =>
      currentCounts.map((count, index) =>
        index === activeIndex ? count + 1 : count,
      ),
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
          className="mx-auto mt-5 grid max-w-[380px] grid-cols-[119px_1fr_34px] items-center gap-3 lg:max-w-[720px] lg:grid-cols-[180px_1fr_42px] lg:gap-6"
        >
          <div className="relative h-[145px] w-[119px] bg-white lg:h-[210px] lg:w-[170px]">
            <Image
              src={activeStory.image}
              alt={activeStory.alt}
              fill
              sizes="(min-width: 1024px) 170px, 119px"
              className="object-contain"
              priority={activeIndex === 0}
            />
          </div>
          <article className="ph-condensed rounded-[20px] bg-[#1e3a8a] px-3 py-4 text-white lg:px-5 lg:py-5">
            <p className="text-[12px] font-bold leading-[1.25] lg:text-[18px]">
              {activeStory.quote}
            </p>
            <p className="mt-4 text-right text-[12px] font-bold lg:text-[18px]">
              {activeStory.name}
            </p>
          </article>
          <button
            type="button"
            onClick={showNextStory}
            className="grid h-8 w-8 place-items-center rounded-full border-2 border-black bg-white text-[22px] font-bold leading-none text-black transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 lg:h-10 lg:w-10 lg:text-[26px]"
            aria-label="Ver siguiente historia"
          >
            →
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-5 lg:justify-end lg:pr-[240px]">
          <span className="ph-condensed text-[24px] font-bold leading-none text-[#6b7280]">
            {counts[activeIndex]}
          </span>
          <IdentifyBadge onClick={identifyWithStory} />
        </div>
      </div>
    </section>
  );
}
