import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StoriesCarousel from "./StoriesCarousel";

export const metadata: Metadata = {
  title: "Por qué PH PLUS | Agua PH PLUS",
  description:
    "Conoce por qué PH PLUS ofrece hidratación consciente, procesos de filtración y testimonios reales.",
};

function VideoFrame({
  src,
  label,
  poster,
  videoClassName = "",
}: {
  src: string;
  label: string;
  poster: string;
  videoClassName?: string;
}) {
  return (
    <video
      className={`block h-full w-full bg-[#e8f6fb] object-cover ${videoClassName}`}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}

function MobileIntro() {
  return (
    <section className="bg-white px-7 pb-3 pt-5 lg:hidden">
      <h1 className="ph-display text-center text-[28px] uppercase leading-none text-[#6b7280]">
        Por qué PH PLUS
      </h1>
    </section>
  );
}

function DesktopIntro() {
  return (
    <section className="hidden bg-white px-6 pb-2 pt-8 text-center lg:block">
      <h1 className="ph-display text-[38px] uppercase leading-none text-[#1e3a8a]">
        Por qué PH PLUS
      </h1>
    </section>
  );
}

function EducationSection() {
  return (
    <section className="bg-white px-6 py-8 lg:py-16">
      <div className="mx-auto grid max-w-[920px] gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
        <div className="hidden lg:block">
          <div className="relative aspect-video overflow-hidden border-[4px] border-[#8a5cf6] bg-white">
            <VideoFrame
              src="/videos/ph-doctor-desktop.mp4"
              poster="/videos/posters/ph-doctor-desktop.jpg"
              label="Video del Dr. Hugo Mario Galindo explicando el pH del agua"
            />
          </div>
        </div>

        <div className="grid gap-5 lg:block">
          <h2 className="ph-condensed text-center text-[26px] font-bold leading-tight text-[#1e3a8a] lg:text-left lg:text-[24px]">
            ¿Por qué el pH del agua es tan importante?
          </h2>
          <div className="mx-auto grid max-w-[330px] grid-cols-[128px_1fr] items-center gap-4 lg:hidden">
            <div className="h-[226px] w-[128px] overflow-hidden rounded-[6px] bg-[#e8f6fb]">
              <VideoFrame
                src="/videos/ph-aguas-mobile.mp4"
                poster="/videos/posters/ph-aguas-mobile.jpg"
                label="Video móvil sobre comparación de aguas y pH"
              />
            </div>
            <p className="ph-condensed text-[15px] font-bold leading-tight text-[#1e3a8a]">
              A través de una demostración práctica, el Dr. Hugo Mario Galindo
              muestra cómo se mide la alcalinidad del agua y qué significa para
              tu día a día.
            </p>
          </div>
          <p className="ph-condensed mt-5 hidden text-[17px] font-bold leading-tight text-[#1e3a8a] lg:block">
            A través de una demostración práctica, el Dr. Hugo Mario Galindo
            con más de 30 años de experiencia en medicina preventiva y
            ortomolecular, te muestra cómo se mide la alcalinidad del agua y qué
            significa esto para tu día a día.
          </p>
        </div>

        <div className="grid gap-5">
          <h2 className="ph-condensed text-center text-[25px] font-bold leading-tight text-[#6b7280] lg:text-left lg:text-[24px]">
            ¿Quieres conocer los procesos de PH PLUS?
          </h2>
          <p className="ph-condensed mx-auto max-w-[310px] text-center text-[15px] font-bold leading-tight text-[#1e3a8a] lg:hidden">
            Conoce el proceso de producción de PH PLUS y los controles que
            permiten obtener un agua con pH 9 de alta pureza y alcalinidad.
          </p>
          <p className="ph-condensed mt-5 hidden text-[17px] font-bold leading-tight text-[#1e3a8a] lg:block">
            Este video te muestra el proceso de producción de PH PLUS, donde
            combinamos tecnología avanzada y controles rigurosos para obtener
            un agua con pH 9 de alta pureza y alcalinidad.
          </p>
        </div>

        <div className="mx-auto aspect-[9/16] h-[220px] w-[150px] overflow-hidden rounded-[6px] border-4 border-white bg-[#e8f6fb] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] lg:mx-0 lg:aspect-video lg:h-auto lg:w-[340px]">
          <VideoFrame
            src="/videos/planta-produccion.mp4"
            poster="/videos/posters/planta-produccion.jpg"
            label="Video del proceso de producción de PH PLUS"
          />
        </div>
      </div>
    </section>
  );
}

function PageCta() {
  return (
    <section className="bg-white px-5 pb-10 pt-2 text-center lg:pb-12">
      <h2 className="ph-condensed mx-auto max-w-[760px] text-[25px] font-bold leading-tight text-[#1e3a8a] lg:max-w-none lg:text-[34px]">
        Únete a miles de personas que ya eligieron mejor
      </h2>
      <p className="ph-condensed mt-4 text-[14px] font-bold text-[#6b7280] lg:text-[22px]">
        Compra fácil por WhatsApp y recíbelo en casa.
      </p>
      <div className="mt-6 flex justify-center">
        <a
          href="https://wa.me/573234392470"
          target="_blank"
          rel="noopener noreferrer"
          className="ph-condensed inline-flex h-[34px] items-center gap-2 rounded-full bg-[#2f6b4f] px-4 text-[12px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.45)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] lg:h-[46px] lg:px-7 lg:text-[18px]"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={28}
            height={28}
            className="h-6 w-6 lg:h-8 lg:w-8"
          />
          Comprar por whatsapp
        </a>
      </div>
      <p className="ph-condensed mt-6 text-[14px] font-bold text-[#6b7280] lg:text-[18px]">
        Respuesta rápida • Entrega a domicilio
      </p>
    </section>
  );
}

export default function PorQuePhPlusPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <MobileIntro />
        <DesktopIntro />
        <EducationSection />
        <StoriesCarousel />
        <PageCta />
      </main>
      <Footer />
    </>
  );
}
