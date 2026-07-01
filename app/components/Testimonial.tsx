import Image from "next/image";
import Link from "next/link";

export default function Testimonial() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1100px] px-5 py-5 sm:px-8 sm:py-12 lg:px-6 lg:py-14">
        <div>
          <h2 className="ph-display text-center text-[24px] uppercase leading-none text-[#1e3a8a] sm:text-[40px] lg:text-[48px]">
            gotas que cuentan historias
          </h2>
        </div>

        <p className="ph-condensed mt-2 text-center text-[16px] font-bold leading-tight text-[#6b7280] sm:mt-7 sm:text-[28px] lg:text-[34px]">
          Cuando más lo necesitaba, PH PLUS estaba ahí.
        </p>

        <div className="mx-auto mt-3 grid max-w-[330px] grid-cols-[119px_1fr] items-center gap-3 sm:mt-9 sm:max-w-none sm:grid-cols-1 sm:gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
          <div className="relative mx-auto h-[145px] w-[119px] bg-white sm:h-[340px] sm:w-[276px] lg:h-[360px] lg:w-[294px]">
            <Image
              src="/testimonial/sirley-drop-real.jpeg"
              alt="Sirley Montoya con agua PH PLUS"
              fill
              sizes="(min-width: 1024px) 294px, (min-width: 640px) 276px, 119px"
              className="object-contain"
            />
          </div>

          <div className="ph-condensed mx-auto w-full max-w-[640px] rounded-[20px] bg-[#1e3a8a] px-3 py-3 text-white shadow-[0_8px_24px_rgba(30,58,138,0.18)] sm:rounded-[26px] sm:px-8 sm:py-7">
            <p className="text-[12px] font-bold leading-[1.28] sm:text-[26px] lg:text-[28px]">
              Durante mi proceso oncológico no toleraba el agua tradicional.
              Con PH PLUS todo cambió: puedo hidratarme con gusto y eso ha sido
              clave en mi recuperación.
            </p>
            <p className="mt-3 text-right text-[12px] font-bold leading-none sm:mt-7 sm:text-left sm:text-[26px] lg:text-[28px]">
              Sirley Montoya
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-center sm:mt-9">
          <Link
            href="/por-que-ph-plus"
            className="ph-condensed inline-flex min-h-[30px] items-center justify-center rounded-[18px] border-2 border-[#1e3a8a] bg-white/10 px-4 text-[10px] font-bold leading-none text-[#6b7280] shadow-[3px_4px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 sm:min-h-[40px] sm:px-6 sm:text-[16px] lg:min-h-[44px] lg:w-[300px] lg:rounded-[28px] lg:px-7 lg:text-[18px]"
          >
            Conoce más historias reales
          </Link>
        </div>
      </div>
    </section>
  );
}
