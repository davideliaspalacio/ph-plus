import Image from "next/image";
import Reveal from "./Reveal";

export default function Testimonial() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:px-6 lg:py-14">
        <Reveal>
          <h2 className="ph-display text-center text-[40px] uppercase leading-none text-[#1e3a8a] sm:text-[48px] lg:text-[48px]">
            gotas que cuentan historias
          </h2>
        </Reveal>

        <Reveal
          as="p"
          delay={90}
          className="ph-condensed mt-7 text-center text-[28px] font-bold leading-tight text-[#6b7280] sm:text-[34px] lg:text-[34px]"
        >
          Cuando más lo necesitaba, PH PLUS estaba ahí.
        </Reveal>

        <div className="mt-9 grid grid-cols-1 items-center gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
          <Reveal
            delay={150}
            className="relative mx-auto h-[340px] w-[276px] lg:h-[360px] lg:w-[294px]"
          >
            <Image
              src="/testimonial/sirley-drop.png"
              alt="Sirley Montoya con agua PH PLUS"
              fill
              sizes="(min-width: 1024px) 379px, 80vw"
              className="object-contain"
            />
          </Reveal>

          <Reveal
            className="ph-condensed mx-auto w-full max-w-[640px] rounded-[26px] bg-[#1e3a8a] px-6 py-6 text-white shadow-[0_8px_24px_rgba(30,58,138,0.18)] sm:px-8 sm:py-7"
            delay={210}
          >
            <p className="text-[23px] font-bold leading-[1.25] sm:text-[26px] lg:text-[28px]">
              Durante mi proceso oncológico no toleraba el agua tradicional.
              Con PH PLUS todo cambió: puedo hidratarme con gusto y eso ha sido
              clave en mi recuperación.
            </p>
            <p className="mt-7 text-[23px] font-bold leading-none sm:text-[26px] lg:text-[28px]">
              Sirley Montoya
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={280}
          className="mt-9 flex justify-center"
        >
          <button
            type="button"
            className="ph-condensed h-[52px] rounded-[32px] border-[4px] border-[#1e3a8a] bg-white/10 px-7 text-[21px] font-bold leading-none text-[#6b7280] shadow-[6px_8px_0_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-0.5 lg:w-[340px] lg:text-[23px]"
          >
            conoce más historias REALES
          </button>
        </Reveal>
      </div>
    </section>
  );
}
