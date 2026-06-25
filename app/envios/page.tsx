import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { formatCOP } from "../lib/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT } from "../lib/cart-summary";
import { mockServerDelay } from "../lib/mock-loading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Costos de envío y tiempos de entrega | PH PLUS",
  description:
    "Consulta los costos de envío, cobertura y tiempos estimados de entrega de Agua PH PLUS.",
};

type ShippingCost = {
  zone: string;
  coverage: string;
  cost: string;
};

type DeliveryTime = {
  zone: string;
  time: string;
};

const SHIPPING_COSTS: ShippingCost[] = [
  {
    zone: "Bogotá",
    coverage: "Cobertura urbana principal",
    cost: formatCOP(SHIPPING_FLAT),
  },
  {
    zone: "Medellín, Barranquilla y Cartagena",
    coverage: "Ciudades principales",
    cost: `Desde ${formatCOP(18000)}`,
  },
  {
    zone: "Alrededores Bogotá",
    coverage: "Cajicá, Tenjo, Tabio, Cota, Chía, Tocancipá y Funza",
    cost: formatCOP(12000),
  },
  {
    zone: "Alrededores Medellín",
    coverage: "Bello, Sabaneta, Envigado e Itagüí",
    cost: formatCOP(18000),
  },
  {
    zone: "Alrededores Barranquilla",
    coverage: "Villacampestre",
    cost: formatCOP(22000),
  },
  {
    zone: "Alrededores Cartagena",
    coverage: "Manzanillo",
    cost: formatCOP(22000),
  },
  {
    zone: "Cali",
    coverage: "Zona urbana",
    cost: formatCOP(18000),
  },
];

const DELIVERY_TIMES: DeliveryTime[] = [
  { zone: "Bogotá", time: "1 a 2 días hábiles" },
  { zone: "Medellín", time: "3 a 5 días hábiles" },
  { zone: "Alrededores Bogotá", time: "2 a 3 días hábiles" },
  { zone: "Alrededores Medellín", time: "3 a 5 días hábiles" },
  { zone: "Barranquilla y Villacampestre", time: "3 a 5 días hábiles" },
  { zone: "Cartagena y Manzanillo", time: "4 a 7 días hábiles" },
  { zone: "Cali", time: "3 a 5 días hábiles" },
];

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand" fill="none" aria-hidden>
      <path
        d="M3 7h11v9H3zM14 10h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7.5v5l3.2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DesktopTable({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-[#d7d7d7] bg-[#f8f8f8] p-6 shadow-[5px_6px_0_rgba(0,0,0,0.24)] lg:p-8">
      <div className="mb-6 flex items-center justify-center gap-3">
        {icon}
        <h2 className="ph-display text-center text-[32px] uppercase leading-none text-[#1e3a8a] lg:text-[40px]">
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
        <section className="mx-auto max-w-[980px] px-5 pb-10 pt-8 text-center sm:px-8 lg:pb-14 lg:pt-10">
          <Reveal>
            <h1 className="ph-display text-[36px] uppercase leading-none text-[#1e3a8a] lg:text-[54px]">
              Costos de envío
            </h1>
            <p className="ph-condensed mx-auto mt-3 max-w-[620px] text-[18px] font-bold leading-tight text-[#6b7280] lg:text-[24px]">
              Verifica cobertura, costos y tiempos antes de comprar.
            </p>
            <p className="ph-condensed mt-4 text-[15px] font-bold text-[#1e3a8a] lg:text-[19px]">
              Envío gratis en compras desde {formatCOP(FREE_SHIPPING_THRESHOLD)}
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-[1050px] px-5 pb-10 sm:px-8 lg:pb-14">
          <Reveal>
            <DesktopTable title="Costos de envío" icon={<TruckIcon />}>
              <div className="hidden overflow-hidden rounded-[12px] border border-[#d7d7d7] bg-white lg:block">
                <div className="grid grid-cols-[1fr_1.5fr_150px] bg-[#1e3a8a] px-5 py-3 text-left text-[14px] font-extrabold uppercase tracking-wide text-white">
                  <span>Zona</span>
                  <span>Cobertura</span>
                  <span className="text-right">Costo</span>
                </div>
                {SHIPPING_COSTS.map((item) => (
                  <div
                    key={item.zone}
                    className="grid grid-cols-[1fr_1.5fr_150px] items-center border-t border-[#e5e7eb] px-5 py-4 text-left"
                  >
                    <p className="ph-condensed text-[20px] font-bold text-[#1e3a8a]">
                      {item.zone}
                    </p>
                    <p className="text-[14px] leading-snug text-[#4b5563]">
                      {item.coverage}
                    </p>
                    <p className="ph-condensed text-right text-[21px] font-bold text-[#1e3a8a]">
                      {item.cost}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 lg:hidden">
                {SHIPPING_COSTS.map((item) => (
                  <article
                    key={item.zone}
                    className="rounded-[12px] border border-[#d7d7d7] bg-white p-4 text-left shadow-[2px_3px_0_rgba(0,0,0,0.18)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="ph-condensed text-[20px] font-bold leading-tight text-[#1e3a8a]">
                        {item.zone}
                      </h3>
                      <p className="ph-condensed shrink-0 text-[19px] font-bold text-[#1e3a8a]">
                        {item.cost}
                      </p>
                    </div>
                    <p className="mt-2 text-[13px] leading-snug text-[#6b7280]">
                      {item.coverage}
                    </p>
                  </article>
                ))}
              </div>
            </DesktopTable>
          </Reveal>
        </section>

        <section className="mx-auto max-w-[1050px] px-5 pb-10 sm:px-8 lg:pb-14">
          <Reveal>
            <DesktopTable title="Tiempos de entrega" icon={<ClockIcon />}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DELIVERY_TIMES.map((item) => (
                  <article
                    key={item.zone}
                    className="flex min-h-[104px] flex-col justify-center rounded-[12px] border border-[#d7d7d7] bg-white px-4 py-4 text-center shadow-[2px_3px_0_rgba(0,0,0,0.18)]"
                  >
                    <h3 className="ph-condensed text-[20px] font-bold leading-tight text-[#1e3a8a]">
                      {item.zone}
                    </h3>
                    <p className="mt-2 text-[14px] font-bold text-[#6b7280]">
                      {item.time}
                    </p>
                  </article>
                ))}
              </div>
            </DesktopTable>
          </Reveal>
        </section>

        <section className="mx-auto max-w-[860px] px-5 pb-14 text-center sm:px-8 lg:pb-16">
          <Reveal>
            <div className="rounded-[22px] bg-[#1e3a8a] px-6 py-7 text-white shadow-[4px_5px_0_rgba(0,0,0,0.22)] lg:px-10">
              <h2 className="ph-display text-[28px] uppercase leading-none lg:text-[36px]">
                Ten presente
              </h2>
              <p className="ph-condensed mx-auto mt-3 max-w-[640px] text-[18px] font-bold leading-tight lg:text-[23px]">
                Botellón solo para Bogotá, Medellín y Cartagena.
              </p>
              <p className="mt-4 text-[13px] leading-relaxed opacity-90 lg:text-[15px]">
                Si no estás seguro de tu zona, escríbenos por WhatsApp y te
                confirmamos el costo exacto antes de finalizar el pedido.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                href="/productos"
                className="ph-condensed inline-flex h-[38px] items-center justify-center rounded-full bg-[#1e3a8a] px-7 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Ver productos
              </Link>
              <a
                href="https://wa.me/573234392470"
                target="_blank"
                rel="noopener noreferrer"
                className="ph-condensed inline-flex h-[36px] items-center gap-2 rounded-full bg-[#2f6b4f] px-5 text-[13px] font-bold text-white shadow-[3px_4px_0_rgba(18,140,126,0.45)] transition-transform hover:scale-[1.03] hover:bg-[#1fb055]"
              >
                <Image
                  src="/icons/whatsapp.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px]"
                />
                Comprar por whatsapp
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
