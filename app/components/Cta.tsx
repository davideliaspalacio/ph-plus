import Image from "next/image";

export default function Cta() {
  return (
    <section className="w-full bg-white py-7 sm:py-12 lg:py-12">
      <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-8 lg:px-6">
        <div>
          <h2 className="ph-condensed text-[24px] font-bold leading-tight text-[#1e3a8a] sm:text-[36px] lg:text-[44px]">
            Elige una hidratación más consciente hoy
          </h2>
          <p className="ph-condensed mt-1 text-[13px] font-bold text-[#6b7280] sm:mt-2 sm:text-[26px] lg:text-[34px]">
            Compra fácil por WhatsApp y recíbelo en casa.
          </p>
        </div>

        <div>
          <div className="mt-4 flex justify-center sm:mt-6">
            <a
              href="https://wa.me/573234392470"
              target="_blank"
              rel="noopener noreferrer"
              className="ph-condensed inline-flex h-[34px] min-w-[168px] items-center justify-center gap-2 rounded-[18px] bg-[#2f6b4f] px-4 text-[12px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.45)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] sm:h-[44px] sm:min-w-[260px] sm:gap-3 sm:px-6 sm:text-[18px] lg:h-[48px] lg:min-w-[300px] lg:text-[20px]"
            >
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={65}
                height={65}
                className="h-6 w-6 sm:h-8 sm:w-8 lg:h-8 lg:w-8"
              />
              <span className="whitespace-nowrap">Comprar por whatsapp</span>
            </a>
          </div>

          <p className="ph-condensed mt-4 text-[13px] font-bold text-[#6b7280] sm:mt-5 sm:text-[26px] lg:text-[27px]">
            Respuesta rápida • Entrega a domicilio
          </p>
        </div>
      </div>
    </section>
  );
}
