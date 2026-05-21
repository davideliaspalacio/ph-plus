import Image from "next/image";
import Reveal from "./Reveal";

export default function Cta() {
  return (
    <section className="w-full bg-white pb-14 pt-6 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-page px-5 text-center sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="text-[22px] font-extrabold leading-tight text-brand sm:text-[26px] lg:text-[28px]">
            Elige una hidratación{" "}
            <span className="text-brand-tint">más consciente</span> hoy
          </h2>
          <p className="mt-4 text-[14px] text-ink-muted sm:text-[16px]">
            Compra fácil por WhatsApp y recibelo en casa.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-7 flex justify-center">
            <a
              href="https://wa.me/573234392470"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-whatsapp px-6 py-3 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(37,211,102,0.35)] transition-transform hover:scale-[1.03] hover:bg-whatsapp-dark sm:px-7 sm:text-[14px]"
            >
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={22}
                height={22}
                className="h-5 w-5"
              />
              comprar por whatsapp
            </a>
          </div>

          <p className="mt-5 text-[12px] text-ink-muted sm:text-[13px]">
            Respuesta rápida • Entrega a domicilio
          </p>
        </Reveal>
      </div>
    </section>
  );
}
