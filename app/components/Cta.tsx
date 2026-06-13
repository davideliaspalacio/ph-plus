import Image from "next/image";
import Reveal from "./Reveal";

export default function Cta() {
  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-12">
      <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8 lg:px-6">
        <Reveal>
          <h2 className="ph-condensed text-[36px] font-light leading-tight text-[#1e3a8a] sm:text-[44px] lg:text-[48px]">
            <span className="font-bold">Elige una hidratación</span>{" "}
            <span className="font-light">más consciente hoy</span>
          </h2>
          <p className="ph-condensed mt-2 text-[26px] font-bold text-[#6b7280] sm:text-[32px] lg:text-[34px]">
            Compra fácil por WhatsApp y recíbelo en casa.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-6 flex justify-center">
            <a
              href="https://wa.me/573234392470"
              target="_blank"
              rel="noopener noreferrer"
              className="ph-condensed inline-flex h-[58px] items-center gap-3 rounded-[34px] bg-[#2f6b4f] px-6 text-[23px] font-bold text-white shadow-[0_6px_18px_rgba(47,107,79,0.25)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] sm:px-8 lg:h-[64px] lg:w-[380px] lg:text-[26px]"
            >
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={65}
                height={65}
                className="h-10 w-10 lg:h-11 lg:w-11"
              />
              <span className="whitespace-nowrap">comprar por whatsapp</span>
            </a>
          </div>

          <p className="ph-condensed mt-5 text-[22px] font-bold text-[#6b7280] sm:text-[26px] lg:text-[27px]">
            Respuesta rápida • Entrega a domicilio
          </p>
        </Reveal>
      </div>
    </section>
  );
}
