const STORIES = [
  {
    headline: "Un aliado clave en mi entrenamiento.",
    name: "Camilo Díaz",
    personVideo: "/videos/testimonios/camilo.mp4",
    personPoster: "/videos/posters/testimonio-camilo.jpg",
    photoAlt: "Camilo Díaz compartiendo su testimonio",
    quote:
      "La hidratación es fundamental para construir músculo, y esta agua me ayuda a equilibrar la acidez que genera tanto la dieta estricta como los entrenamientos intensos. Tomo 5 litros diarios y los resultados hablan por sí solos.",
    variant: "gradient",
  },
  {
    headline: "La pruebas una vez y no vuelves a la normalidad.",
    name: "Dra Martha Liliana López",
    personVideo: "/videos/testimonios/martha.mp4",
    personPoster: "/videos/posters/testimonio-martha.jpg",
    photoAlt: "Dra Martha Liliana López compartiendo su testimonio",
    quote:
      "Y no es solo para hidratarse: va increíble como tónico facial para una piel radiante, y aplicada en el cabello después del lavado. Además, elimina metales pesados, reduce, la acidez del cuerpo sin necesidad de agregarle nada.",
    variant: "solid",
  },
  {
    headline: "El agua que cuida tu salud desde adentro",
    name: "Daniel Rojas",
    personVideo: "/videos/testimonios/daniel.mp4",
    personPoster: "/videos/posters/testimonio-daniel.jpg",
    photoAlt: "Daniel Rojas compartiendo su testimonio",
    quote:
      "Los cuerpos ácidos son terreno fértil para enfermedades, y consumir agua alcalina es una forma sencilla y natural de contrarrestar eso. Además, tienen sabores como limonaria sin saborizantes artificiales, 100% naturales y que mantienen el pH alcalino.",
    variant: "gradient",
  },
];

function DropIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 24"
      aria-hidden
      className={`shrink-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] ${className}`}
    >
      <path
        d="M9 1C7.2 5.1 2 10.3 2 15.2A7 7 0 0016 15.2C16 10.3 10.8 5.1 9 1Z"
        fill="#11d7e5"
        stroke="#d9fbff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function TestimonialCard({ story }: { story: (typeof STORIES)[number] }) {
  const cardBg =
    story.variant === "solid"
      ? "bg-[#263f99]"
      : "bg-linear-to-r from-[#54d9df] via-[#2397d5] to-[#0d4fb8]";

  return (
    <div
      className={`ph-condensed relative aspect-[125/196] w-full overflow-hidden rounded-[18px] px-5 pb-7 pt-6 text-white shadow-[12px_14px_0_rgba(30,58,138,0.22)] sm:px-6 sm:pb-8 sm:pt-7 lg:rounded-[22px] lg:px-7 lg:pb-10 lg:pt-8 ${cardBg}`}
    >
      <div className="grid grid-cols-[47%_1fr] items-center gap-4 lg:gap-7">
        <div className="relative aspect-[58/75] w-full overflow-hidden rounded-[8px] bg-white/5">
          <video
            className="h-full w-full object-cover"
            src={story.personVideo}
            poster={story.personPoster}
            controls
            playsInline
            preload="metadata"
            aria-label={story.photoAlt}
          />
        </div>
        <p className="text-[17px] font-bold leading-[1.14] sm:text-[20px] lg:text-[26px]">
          {story.name}
        </p>
      </div>

      <p className="mt-7 text-[12px] font-bold leading-[1.32] sm:mt-8 sm:text-[14px] lg:mt-10 lg:text-[19px] lg:leading-[1.3]">
        {story.quote}
      </p>
    </div>
  );
}

export default function StoriesCarousel() {
  return (
    <section
      id="testimonios"
      className="scroll-mt-28 bg-white px-5 pb-10 pt-8 lg:scroll-mt-32 lg:px-8 lg:pb-16 lg:pt-10"
    >
      <h2 className="sr-only">Gotas que cuentan historias</h2>

      <div className="mx-auto grid max-w-[420px] gap-9 sm:max-w-[760px] sm:grid-cols-2 lg:max-w-[1420px] lg:grid-cols-3 lg:gap-8">
        {STORIES.map((story) => (
          <article key={story.name} className="flex flex-col items-center">
            <h3 className="ph-condensed flex min-h-[58px] max-w-[310px] items-start justify-center gap-2 text-center text-[24px] font-bold leading-[1.05] text-[#6b7280] sm:min-h-[76px] sm:text-[28px] lg:min-h-[98px] lg:max-w-[360px] lg:text-[34px]">
              <DropIcon className="mt-0.5 h-6 w-4 sm:h-7 sm:w-5 lg:h-8 lg:w-6" />
              <span>{story.headline}</span>
            </h3>

            <div className="relative mt-4 w-full max-w-[250px] sm:max-w-[280px] lg:mt-6 lg:max-w-[382px]">
              <TestimonialCard story={story} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
