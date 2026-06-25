import type { Metadata } from "next";

import Header from "../components/Header";
import Reveal from "../components/Reveal";
import { mockServerDelay } from "../lib/mock-loading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Costos de envío y tiempos de entrega | PH PLUS",
  description:
    "Consulta los costos de envío, cobertura y tiempos estimados de entrega de Agua PH PLUS.",
};

const SHIPPING_ROWS = [
  {
    text: "Envío Bogotá - Medellín - Barranquilla - Cartagena",
    price: "$11.000",
    emphasis: true,
  },
  {
    text: "Envío Alrededores Bogotá: Cajica, Tenjo, Tabio, Cota, Chía, Tocancipa, Funza",
    price: "$15.000",
  },
  {
    text: "Envío Alrededores Medellín",
    price: "$15.000",
  },
  {
    text: "Bello, Sabaneta, Envigado, Itagui",
    price: "$15.000",
    noBullet: true,
  },
  {
    text: "Envío Alrededores Barranquilla: Villacampestre",
    price: "$15.000",
  },
  {
    text: "Envío Alrededores Cartagena: Manzanillo",
    price: "$15.000",
  },
  {
    text: "Cali",
    price: "$15.000",
  },
];

const DELIVERY_ROWS = [
  { zone: "Alrededores Bogotá:", day: "jueves-viernes" },
  { zone: "Medellín", day: "martes y jueves" },
  { zone: "Alrededores Medellín", day: "martes y jueves" },
  { zone: "Barranquilla y Villacampestre", day: "martes y jueves" },
  { zone: "Cartagena y Manzanillo", day: "martes y jueves" },
  { zone: "Cali", day: "martes y jueves" },
];

function DeliveryTruckIcon() {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-black bg-white text-black lg:h-12 lg:w-12">
      <svg viewBox="0 0 64 64" className="h-7 w-7 lg:h-8 lg:w-8" fill="none" aria-hidden>
        <path
          d="M8 22h31v22H8zM39 30h9l8 8v6H39z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <circle cx="20" cy="48" r="5" stroke="currentColor" strokeWidth="4" />
        <circle cx="48" cy="48" r="5" stroke="currentColor" strokeWidth="4" />
      </svg>
    </span>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[900px] rounded-[8px] border border-[#d7d7d7] bg-white px-6 py-7 shadow-[4px_4px_0_rgba(0,0,0,0.24)] lg:px-9 lg:py-8">
      <div className="mb-6 flex items-center justify-center gap-5">
        <DeliveryTruckIcon />
        <h2 className="ph-display text-[26px] uppercase leading-none text-[#1e3a8a] lg:text-[31px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default async function EnviosPage() {
  await mockServerDelay();

  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <section className="bg-[#252bae] px-6 py-12 text-center text-white lg:py-14">
          <Reveal>
            <h1 className="ph-condensed text-[25px] font-bold leading-tight lg:text-[32px]">
              Llevamos PH PLUS hasta tu puerta
            </h1>
            <p className="ph-condensed mx-auto mt-10 max-w-[735px] text-[21px] font-bold leading-snug lg:text-[28px]">
              Operamos en Bogotá, Medellín, Barranquilla, Cartagena y Cali.
              Consulta abajo los costos exactos según tu zona y los tiempos
              estimados de entrega.
            </p>
          </Reveal>
        </section>

        <section className="px-5 pb-16 pt-9 lg:pb-20">
          <Reveal>
            <p className="ph-condensed text-center text-[22px] font-bold leading-tight text-[#6b7280] lg:text-[28px]">
              Botellón solo para Bogotá, Medellín y Cartagena
            </p>
          </Reveal>

          <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-24">
            <Reveal>
              <InfoCard title="Costos de envío">
                <div className="space-y-4">
                  {SHIPPING_ROWS.map((row) => (
                    <div
                      key={row.text}
                      className="grid grid-cols-[1fr_auto] items-start gap-4 lg:grid-cols-[minmax(0,1fr)_150px] lg:gap-8"
                    >
                      <p
                        className={
                          "ph-condensed text-[18px] leading-tight lg:text-[25px] " +
                          (row.emphasis
                            ? "font-bold text-[#6b7280]"
                            : "font-light text-black")
                        }
                      >
                        {!row.noBullet && <span className="mr-4">•</span>}
                        {row.text}
                      </p>
                      <p className="ph-condensed text-right text-[19px] font-bold leading-tight text-[#1e3a8a] lg:text-[26px]">
                        {row.price}
                      </p>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </Reveal>

            <Reveal>
              <InfoCard title="Tiempos de entrega">
                <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:gap-x-12">
                  <p className="ph-condensed text-[20px] font-bold leading-tight text-[#6b7280] lg:text-[25px]">
                    <span className="mr-4">•</span>
                    Bogotá
                  </p>
                  <p className="ph-condensed text-[20px] font-bold leading-tight text-[#1e3a8a] lg:text-[25px]">
                    Norte: 2 días hábiles / Centro, Oriente y Occiente: hasta
                    3 días hábiles / Sur: hasta 4 días hábiles
                  </p>

                  <div className="space-y-3 lg:pt-8">
                    {DELIVERY_ROWS.map((row) => (
                      <p
                        key={row.zone}
                        className="ph-condensed text-[18px] font-light leading-tight text-black lg:text-[24px]"
                      >
                        <span className="mr-4">•</span>
                        {row.zone}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-3 lg:pt-8">
                    {DELIVERY_ROWS.map((row) => (
                      <p
                        key={row.zone}
                        className="ph-condensed text-[20px] font-bold leading-tight text-[#1e3a8a] lg:text-[25px]"
                      >
                        {row.day}
                      </p>
                    ))}
                  </div>
                </div>
              </InfoCard>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
