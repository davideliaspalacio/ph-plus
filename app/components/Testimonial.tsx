import Reveal from "./Reveal";

function PersonInDrop() {
  return (
    <svg viewBox="0 0 220 280" className="h-56 w-auto sm:h-64 lg:h-72" aria-hidden>
      <defs>
        <clipPath id="dropClip">
          <path d="M110 8 C110 8 18 110 18 188 C18 240 60 272 110 272 C160 272 202 240 202 188 C202 110 110 8 110 8 Z" />
        </clipPath>
      </defs>
      <path
        d="M110 8 C110 8 18 110 18 188 C18 240 60 272 110 272 C160 272 202 240 202 188 C202 110 110 8 110 8 Z"
        fill="#cfd6f2"
        stroke="#1b22a6"
        strokeWidth="2"
      />
      <g clipPath="url(#dropClip)">
        <rect x="0" y="0" width="220" height="280" fill="#e6e9f3" />
        <circle cx="110" cy="130" r="34" fill="#d8b08a" />
        <rect x="62" y="160" width="96" height="120" rx="18" fill="#7a9a6f" />
        <ellipse cx="150" cy="200" rx="22" ry="38" fill="#a6c8e6" />
        <rect x="142" y="170" width="18" height="14" rx="2" fill="#1b22a6" />
        <path d="M88 130 q22 14 44 0" fill="none" stroke="#5a3a1a" strokeWidth="1.5" />
        <circle cx="98" cy="124" r="3" fill="#222" />
        <circle cx="120" cy="124" r="3" fill="#222" />
      </g>
    </svg>
  );
}

export default function Testimonial() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2 className="text-center text-[22px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[26px] lg:text-[28px]">
            Gotas que cuentan historias
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-[980px] flex-col items-center gap-6 lg:mt-12 lg:flex-row lg:items-center lg:gap-8">
          <Reveal className="shrink-0" delay={100}>
            <PersonInDrop />
          </Reveal>

          <Reveal className="w-full flex-1" delay={220}>
            <div className="rounded-2xl bg-brand p-6 text-white shadow-[0_8px_30px_rgba(27,34,166,0.18)] sm:p-8">
              <p className="text-[14px] leading-[1.65] sm:text-[15px]">
                Cuando más lo necesitaba, PH PLUS estaba ahí.
              </p>
              <p className="mt-4 text-[14px] leading-[1.65] sm:text-[15px]">
                Durante mi proceso oncológico no toleraba el agua
                tradicional. Con PH PLUS todo cambió: puedo hidratarme con
                gusto y eso ha sido clave en mi recuperación.
              </p>
              <p className="mt-6 text-[14px] font-semibold sm:text-[15px]">
                Sirley Montoya
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="rounded-t-xl border border-card-border bg-white px-5 py-2.5 text-[12px] font-semibold text-brand shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_6px_18px_rgba(27,34,166,0.12)] sm:px-6 sm:text-[13px]"
          >
            conoce más historias REALES
          </button>
        </div>
      </div>
    </section>
  );
}
