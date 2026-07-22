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
        ¿Por qué PH PLUS?
      </h1>
    </section>
  );
}

function DesktopIntro() {
  return (
    <section className="hidden bg-white px-6 pb-2 pt-8 text-center lg:block">
      <h1 className="ph-display text-[38px] uppercase leading-none text-[#1e3a8a]">
        ¿Por qué PH PLUS?
      </h1>
    </section>
  );
}

/** Educación en mobile: matchea el frame — texto IZQ + media DER en ambas. */
function MobileEducation() {
  return (
    <section className="bg-white px-6 py-8 lg:hidden">
      <div className="mx-auto max-w-[360px] space-y-12">
        <div className="grid grid-cols-[1fr_125px] gap-4">
          <div>
            <h2 className="ph-condensed text-center text-[20px] font-bold leading-tight text-[#1e3a8a]">
              ¿Por qué el pH del agua es tan importante?
            </h2>
            <p className="ph-condensed mt-3 text-[13px] font-bold leading-tight text-[#1e3a8a]">
              En esta demostración comparamos el nivel de PH de diferentes
              bebidas usando un PHmetro y espectro de colorimetría. PH Plus
              registra PH 9 — el nivel óptimo para equilibrar tu cuerpo,
              eliminar acidez y mejorar tu hidratación. No es opinión, es
              química.
            </p>
          </div>
          <div className="min-h-[190px] w-[125px] overflow-hidden rounded-[6px] bg-[#e8f6fb]">
            <VideoFrame
              src="/videos/ph-aguas-mobile.mp4"
              poster="/videos/posters/ph-aguas-mobile.jpg"
              label="Video móvil sobre comparación de aguas y pH"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_125px] gap-4">
          <div>
            <h2 className="ph-condensed text-center text-[20px] font-bold leading-tight text-[#6b7280]">
              ¿Quieres conocer los procesos de PH PLUS?
            </h2>
            <p className="ph-condensed mt-3 text-[13px] font-bold leading-tight text-[#1e3a8a]">
              Este video te muestra el proceso de producción de PH PLUS, donde
              combinamos tecnología avanzada y controles rigurosos para obtener
              un agua con pH 9 de alta pureza y alcalinidad.
            </p>
          </div>
          <div className="min-h-[190px] w-[125px] overflow-hidden rounded-[6px] bg-[#e8f6fb]">
            <VideoFrame
              src="/videos/planta-produccion.mp4"
              poster="/videos/posters/planta-produccion.jpg"
              label="Video del proceso de producción de PH PLUS"
              videoClassName="object-[50%_25%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Educación en desktop: se mantiene el layout actual (grilla 2×2). */
function DesktopEducation() {
  return (
    <section className="hidden bg-white px-6 py-16 lg:block">
      <div className="mx-auto grid max-w-[920px] grid-cols-2 gap-x-16 gap-y-14">
        <div>
          <div className="relative aspect-video overflow-hidden border-[4px] border-[#8a5cf6] bg-white">
            <VideoFrame
              src="/videos/ph-doctor-desktop.mp4"
              poster="/videos/posters/ph-doctor-desktop.jpg"
              label="Video del Dr. Hugo Mario Galindo explicando el pH del agua"
            />
          </div>
        </div>

        <div>
          <h2 className="ph-condensed text-left text-[24px] font-bold leading-tight text-[#1e3a8a]">
            ¿Por qué el pH del agua es tan importante?
          </h2>
          <p className="ph-condensed mt-5 text-[17px] font-bold leading-tight text-[#1e3a8a]">
            A través de una demostración práctica, el Dr. Hugo Mario Galindo
            con más de 30 años de experiencia en medicina preventiva y
            ortomolecular, te muestra cómo se mide la alcalinidad del agua y qué
            significa esto para tu día a día.
          </p>
        </div>

        <div>
          <h2 className="ph-condensed text-left text-[24px] font-bold leading-tight text-[#6b7280]">
            ¿Quieres conocer los procesos de PH PLUS?
          </h2>
          <p className="ph-condensed mt-5 text-[17px] font-bold leading-tight text-[#1e3a8a]">
            Este video te muestra el proceso de producción de PH PLUS, donde
            combinamos tecnología avanzada y controles rigurosos para obtener
            un agua con pH 9 de alta pureza y alcalinidad.
          </p>
        </div>

        <div className="aspect-video w-[340px] overflow-hidden rounded-[6px] border-4 border-white bg-[#e8f6fb] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
          <VideoFrame
            src="/videos/planta-produccion.mp4"
            poster="/videos/posters/planta-produccion.jpg"
            label="Video del proceso de producción de PH PLUS"
            videoClassName="object-[50%_25%]"
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
        <MobileEducation />
        <DesktopEducation />
        <StoriesCarousel />
        <PageCta />
      </main>
      <Footer />
    </>
  );
}
