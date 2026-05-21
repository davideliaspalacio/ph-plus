import type { Metadata } from "next";
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
  title: "Envíos y tiempos de entrega — PH PLUS",
  description:
    "Conoce nuestras zonas de cobertura, costos de envío y tiempos estimados de entrega. Envío gratis sobre $120.000.",
};

type Zone = {
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  time: string;
  badge?: string;
};

const ZONES: Zone[] = [
  {
    name: "Bogotá D.C. y zona urbana",
    description:
      "Localidades de Bogotá, Soacha, Chía, Cota, Funza, Mosquera, Cajicá, La Calera y municipios vecinos.",
    price: formatCOP(SHIPPING_FLAT),
    priceNote: `Gratis sobre ${formatCOP(FREE_SHIPPING_THRESHOLD)}`,
    time: "Mismo día o 24 horas hábiles",
    badge: "Cobertura prioritaria",
  },
  {
    name: "Resto de Cundinamarca",
    description:
      "Municipios como Zipaquirá, Facatativá, Madrid, Fusagasugá y otros del departamento.",
    price: formatCOP(12000),
    priceNote: `Gratis sobre ${formatCOP(FREE_SHIPPING_THRESHOLD)}`,
    time: "24 a 48 horas hábiles",
  },
  {
    name: "Eje cafetero, Antioquia y Valle",
    description:
      "Medellín, Cali, Manizales, Pereira, Armenia y municipios cercanos.",
    price: formatCOP(15000),
    time: "2 a 4 días hábiles",
  },
  {
    name: "Resto de Colombia",
    description:
      "Costa Caribe, Santanderes, Boyacá, Tolima, sur del país y demás departamentos.",
    price: formatCOP(22000),
    time: "3 a 6 días hábiles",
  },
];

const SCHEDULE = [
  { day: "Lunes a viernes", hours: "8:00 am – 5:00 pm" },
  { day: "Sábados", hours: "8:00 am – 12:00 pm" },
  { day: "Domingos y festivos", hours: "Sin operación" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cuándo despachan mi pedido?",
    a: "Los pedidos confirmados antes de las 12:00 m. se despachan el mismo día en Bogotá y zona urbana. Después de esa hora se despachan al siguiente día hábil.",
  },
  {
    q: "¿Puedo escoger una franja horaria de entrega?",
    a: "En Bogotá y municipios cercanos puedes solicitar franja AM (8 am – 12 pm) o PM (12 pm – 5 pm) en las notas del checkout o por WhatsApp.",
  },
  {
    q: "¿Recogen el botellón vacío?",
    a: "Sí. En las recargas y suscripciones se incluye la recolección del envase vacío. Tenlo listo el día de la entrega.",
  },
  {
    q: "¿Qué pasa si no estoy en casa al momento de la entrega?",
    a: "Te contactamos para reprogramar. Si necesitas dejar el pedido con un vecino o portería, indícalo en las notas de envío.",
  },
  {
    q: "¿Cómo aplican los envíos gratis?",
    a: `Compras desde ${formatCOP(FREE_SHIPPING_THRESHOLD)} en Bogotá y Cundinamarca aplican envío gratis automáticamente al llegar al carrito.`,
  },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand" aria-hidden>
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 6.5 8 12 8 12s8-5.5 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" aria-hidden>
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

export default async function EnviosPage() {
  await mockServerDelay();
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <nav className="mx-auto max-w-page px-5 pt-6 text-[12px] text-ink-muted sm:px-8 sm:text-[13px] lg:px-12">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Envíos y entregas</span>
        </nav>

        <section className="w-full bg-linear-to-br from-brand via-brand to-brand-dark text-white">
          <div className="mx-auto max-w-page px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <Reveal>
              <div className="flex flex-col items-start gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur">
                  <TruckIcon />
                  Información de envíos
                </span>
                <h1 className="text-[28px] font-extrabold leading-tight sm:text-[36px] lg:text-[44px]">
                  Llevamos PH PLUS hasta tu puerta
                </h1>
                <p className="max-w-2xl text-[14px] leading-[1.6] opacity-95 sm:text-[16px]">
                  Operamos en Bogotá, Cundinamarca y las principales ciudades
                  del país. Consulta abajo los costos exactos según tu zona y
                  los tiempos estimados de entrega.
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-whatsapp px-4 py-2 text-[13px] font-semibold shadow-[0_6px_18px_rgba(37,211,102,0.35)]">
                  <span aria-hidden>✓</span>
                  Envío gratis en compras desde {formatCOP(FREE_SHIPPING_THRESHOLD)}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-page px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <Reveal>
            <h2 className="text-[22px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[26px]">
              Zonas y costos
            </h2>
            <p className="mt-2 text-[14px] text-ink-muted sm:text-[15px]">
              Los precios son por pedido. Los tiempos cuentan desde la confirmación de pago.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {ZONES.map((z, i) => (
              <Reveal key={z.name} delay={i * 100}>
                <article className="flex h-full flex-col gap-3 rounded-2xl border border-card-border bg-white p-6 transition-shadow hover:shadow-[0_10px_30px_rgba(27,34,166,0.08)]">
                  <div className="flex items-start gap-3">
                    <PinIcon />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[16px] font-extrabold text-brand sm:text-[18px]">
                          {z.name}
                        </h3>
                        {z.badge && (
                          <span className="rounded-full bg-accent-cyan px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                            {z.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] leading-[1.55] text-ink-muted">
                        {z.description}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-2 grid grid-cols-2 gap-3 border-t border-card-border pt-4 text-[13px]">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        Costo de envío
                      </dt>
                      <dd className="mt-1 text-[18px] font-extrabold text-brand">
                        {z.price}
                      </dd>
                      {z.priceNote && (
                        <dd className="mt-0.5 text-[11px] text-whatsapp-dark">
                          {z.priceNote}
                        </dd>
                      )}
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                        Tiempo de entrega
                      </dt>
                      <dd className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                        <ClockIcon />
                        {z.time}
                      </dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-card-border bg-[#fafbfd] py-12 sm:py-14">
          <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Reveal>
                <div className="rounded-2xl border border-card-border bg-white p-6">
                  <h2 className="text-[18px] font-extrabold text-brand">
                    Horarios de operación
                  </h2>
                  <p className="mt-1 text-[13px] text-ink-muted">
                    Procesamos y despachamos pedidos en estos horarios.
                  </p>
                  <ul className="mt-4 divide-y divide-card-border">
                    {SCHEDULE.map((s) => (
                      <li
                        key={s.day}
                        className="flex items-center justify-between py-3 text-[14px]"
                      >
                        <span className="text-ink">{s.day}</span>
                        <span className="font-semibold text-brand">
                          {s.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-[#eef0ff] p-4 text-[12px] text-brand">
                    Los pedidos confirmados después de las 12:00 m. en zona
                    urbana se despachan al siguiente día hábil.
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="rounded-2xl border border-card-border bg-brand p-6 text-white">
                  <h2 className="text-[18px] font-extrabold">
                    ¿No estás seguro de tu zona?
                  </h2>
                  <p className="mt-2 text-[14px] leading-[1.6] opacity-95">
                    Escríbenos por WhatsApp con tu dirección y te confirmamos
                    al instante el costo exacto y el día estimado de entrega.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="https://wa.me/573234392470"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-[13px] font-semibold transition-transform hover:scale-[1.03] hover:bg-whatsapp-dark"
                    >
                      <Image
                        src="/icons/whatsapp.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      Consultar por WhatsApp
                    </a>
                    <Link
                      href="/productos"
                      className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-white hover:text-brand"
                    >
                      Ver productos
                    </Link>
                  </div>
                  <p className="mt-4 text-[12px] opacity-80">
                    Tel / WhatsApp: +57 323 439 2470 · info@aguaphplus.com
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-page px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <Reveal>
            <h2 className="text-[22px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[26px]">
              Preguntas frecuentes
            </h2>
          </Reveal>

          <div className="mt-6 mx-auto max-w-3xl space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 80}>
                <details className="group rounded-xl border border-card-border bg-white p-5 transition-shadow open:shadow-[0_6px_18px_rgba(27,34,166,0.06)]">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14px] font-semibold text-brand">
                    {f.q}
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eef0ff] text-brand transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[13px] leading-[1.6] text-ink">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
