import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Puntos de venta | Agua PH PLUS",
  description:
    "Encuentra Agua PH PLUS en farmacias, hoteles, supermercados, restaurantes y clubes deportivos.",
};

type Logo = {
  src: string;
  alt: string;
  className?: string;
};

type Category = {
  title: string;
  logos: Logo[];
};

const CATEGORIES: Category[] = [
  {
    title: "Farmacias",
    logos: [
      { src: "/HOME PHPLUS/cruzverde ok.png", alt: "Cruz Verde", className: "w-[112px] lg:w-[164px]" },
      { src: "/HOME PHPLUS/farmatodo.png", alt: "Farmatodo", className: "w-[112px] lg:w-[158px]" },
      { src: "/HOME PHPLUS/pasteur 1.png", alt: "Pasteur", className: "w-[92px] lg:w-[142px]" },
      { src: "/HOME PHPLUS/locatel ok 1.png", alt: "Locatel", className: "w-[68px] lg:w-[108px]" },
      { src: "/HOME PHPLUS/habib ok.png", alt: "Droguerías Habib", className: "w-[92px] lg:w-[134px]" },
      { src: "/HOME PHPLUS/farmavida.png", alt: "Droguería Farmavida", className: "w-[110px] lg:w-[170px]" },
    ],
  },
  {
    title: "Hoteles",
    logos: [
      { src: "/HOME PHPLUS/marriot.png", alt: "Marriott", className: "w-[72px] lg:w-[116px]" },
      { src: "/HOME PHPLUS/intercontinental.png", alt: "InterContinental", className: "w-[126px] lg:w-[202px]" },
      { src: "/HOME PHPLUS/binn.png", alt: "Binn Hotel", className: "w-[68px] lg:w-[108px]" },
      { src: "/HOME PHPLUS/haven.png", alt: "Haven Hotel", className: "w-[64px] lg:w-[96px]" },
      { src: "/HOME PHPLUS/wam.png", alt: "Wam", className: "w-[48px] lg:w-[72px]" },
    ],
  },
  {
    title: "Supermercados",
    logos: [
      { src: "/HOME PHPLUS/log de carulla recortado 1.png", alt: "Carulla", className: "w-[82px] lg:w-[124px]" },
      { src: "/HOME PHPLUS/exito ok.png", alt: "Éxito", className: "w-[78px] lg:w-[118px]" },
      { src: "/HOME PHPLUS/jumbo sin fondo.png", alt: "Jumbo", className: "w-[58px] lg:w-[88px]" },
      { src: "/HOME PHPLUS/mercaldas.png", alt: "Mercaldas", className: "w-[72px] lg:w-[112px]" },
      { src: "/HOME PHPLUS/olimpica.png", alt: "Olímpica", className: "w-[82px] lg:w-[124px]" },
      { src: "/HOME PHPLUS/fithub ok.png", alt: "Fithub", className: "w-[74px] lg:w-[116px]" },
    ],
  },
  {
    title: "Restaurantes",
    logos: [
      { src: "/HOME PHPLUS/ROKO.png", alt: "Rokko", className: "w-[70px] lg:w-[112px]" },
      { src: "/HOME PHPLUS/HARRYS.png", alt: "Harrys", className: "w-[44px] lg:w-[72px]" },
      { src: "/HOME PHPLUS/SALVAJE.png", alt: "Salvaje", className: "w-[38px] lg:w-[58px]" },
      { src: "/HOME PHPLUS/LA ÚNICA.png", alt: "La Única", className: "w-[42px] lg:w-[68px]" },
      { src: "/HOME PHPLUS/CUMBIA HOUSE.png", alt: "Cumbia House", className: "w-[46px] lg:w-[72px]" },
      { src: "/HOME PHPLUS/OSAKA.png", alt: "Osaka", className: "w-[86px] lg:w-[132px]" },
      { src: "/HOME PHPLUS/NOA.png", alt: "Noa", className: "w-[38px] lg:w-[60px]" },
      { src: "/HOME PHPLUS/CALLE DRAGONES.png", alt: "Calle Dragones", className: "w-[46px] lg:w-[72px]" },
    ],
  },
  {
    title: "Clubes deportivos",
    logos: [
      { src: "/HOME PHPLUS/CLUB EL NOGAL.png", alt: "Club El Nogal", className: "w-[74px] lg:w-[112px]" },
      { src: "/HOME PHPLUS/CLUB HATOGRANDE.png", alt: "Hatogrande Golf & Tennis Country Club", className: "w-[72px] lg:w-[108px]" },
    ],
  },
];

function CategoryPanel({ category }: { category: Category }) {
  return (
    <section className="pt-8 lg:pt-10">
      <h2 className="ph-display text-center text-[28px] uppercase leading-none text-[#1e3a8a] lg:text-[32px]">
        {category.title}
      </h2>
      <div className="mx-auto mt-5 flex min-h-[95px] max-w-[336px] flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-[10px] border border-[#d7d7d7] bg-[#f8f8f8] px-4 py-4 shadow-[4px_5px_0_rgba(0,0,0,0.28)] lg:min-h-[106px] lg:max-w-[820px] lg:gap-x-8 lg:gap-y-4 lg:px-8">
        {category.logos.map((logo) => (
          <div key={logo.src} className="grid h-[36px] place-items-center lg:h-[48px]">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={180}
              height={80}
              className={`h-auto object-contain ${logo.className ?? "w-[90px]"}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnerCard() {
  return (
    <section className="mx-auto mt-9 max-w-[336px] lg:max-w-[780px]">
      <div className="rounded-[18px] bg-[#1e3a8a] px-5 py-5 text-white lg:rounded-[28px] lg:px-10 lg:py-6">
        <h2 className="ph-condensed text-center text-[17px] font-bold leading-none lg:text-[32px]">
          Crezcamos juntos
        </h2>
        <p className="ph-condensed mt-3 text-[14px] font-bold leading-[1.25] lg:text-[21px]">
          ¿Te interesa vender PH PLUS o distribuir nuestros productos? Estamos
          ampliando nuestra red de aliados en Colombia y explorando nuevos
          mercados internacionales. Buscamos socios estratégicos que quieran
          crecer con una marca en constante expansión.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <a
          href="https://wa.me/573234392470"
          target="_blank"
          rel="noopener noreferrer"
          className="ph-condensed inline-flex h-[29px] items-center gap-1.5 rounded-full border-2 border-[#1e3a8a] bg-white px-3 text-[10px] font-bold text-[#6b7280] shadow-[3px_4px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 lg:h-[38px] lg:px-5 lg:text-[15px]"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={24}
            height={24}
            className="h-5 w-5 lg:h-6 lg:w-6"
          />
          Me interesa ser aliado
        </a>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="px-5 pb-9 pt-4 text-center lg:pb-12 lg:pt-6">
      <h2 className="ph-condensed mx-auto max-w-[720px] text-[27px] font-bold leading-tight text-[#1e3a8a] lg:text-[38px]">
        No es solo agua. Es lo que eliges para tu cuerpo.
        <br />
        Empieza hoy a hidratarte mejor
      </h2>
      <p className="ph-condensed mt-7 text-[14px] font-bold text-[#6b7280] lg:text-[22px]">
        Compra fácil por WhatsApp y recíbelo en casa.
      </p>
      <div className="mt-4 flex justify-center">
        <a
          href="https://wa.me/573234392470"
          target="_blank"
          rel="noopener noreferrer"
          className="ph-condensed inline-flex h-[31px] items-center gap-2 rounded-full bg-[#2f6b4f] px-3 text-[10px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.45)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055] lg:h-[46px] lg:px-7 lg:text-[18px]"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={26}
            height={26}
            className="h-6 w-6 lg:h-8 lg:w-8"
          />
          comprar por whatsapp
        </a>
      </div>
      <p className="ph-condensed mt-5 text-[14px] font-bold text-[#6b7280] lg:text-[18px]">
        Respuesta rápida • Entrega a domicilio
      </p>
    </section>
  );
}

export default function PuntosDeVentaPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="px-5 pt-4 text-center lg:pt-8">
          <h1 className="ph-display text-[30px] uppercase leading-none text-[#1e3a8a] lg:text-[36px]">
            Siempre cerca de ti
          </h1>
          <p className="ph-condensed mx-auto mt-2 max-w-[330px] text-[22px] font-bold leading-[1.22] text-[#6b7280] lg:max-w-[760px] lg:text-[24px]">
            En puntos de venta a nivel nacional
            <br className="lg:hidden" />{" "}
            <span className="text-[#1e3a8a]">y directo en tu domicilio.</span>
          </p>
        </section>

        <div className="px-5">
          {CATEGORIES.map((category) => (
            <CategoryPanel key={category.title} category={category} />
          ))}
        </div>

        <PartnerCard />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
