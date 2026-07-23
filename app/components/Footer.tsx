import Image from "next/image";
import Link from "next/link";

import NewsletterSignup from "./NewsletterSignup";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Av%20km%201.5%20via%20Siberia%20Parque%20Agroindustrial%20de%20Occidente%20Bodega%202%20local%2078%20Cota%20Cundinamarca";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aguaphplus",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/aguaphplus",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@aguaphplus",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aguaphplus",
  },
];

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        "relative shrink-0 " +
        (compact
          ? "h-[19px] w-[64px] min-[700px]:h-[30px] min-[700px]:w-[106px]"
          : "h-[44px] w-[148px] 2xl:h-[62px] 2xl:w-[208px]")
      }
      role="group"
      aria-label="Redes sociales de PH PLUS"
    >
      <Image
        src="/footer/social-icons.png"
        alt=""
        fill
        sizes={compact ? "(min-width: 700px) 106px, 64px" : "(min-width: 1536px) 208px, 148px"}
        className="object-contain"
      />
      {SOCIAL_LINKS.map((social, index) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${social.label} de PH PLUS`}
          className="absolute inset-y-0 transition-transform hover:-translate-y-0.5"
          style={{ left: `${index * 25}%`, width: "25%" }}
        />
      ))}
    </div>
  );
}

function PinIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0`} aria-hidden>
      <ellipse
        cx="50"
        cy="82"
        rx="32"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      />
      <path
        d="M50 9C32.9 9 19 22.5 19 39.1 19 63.7 50 83 50 83s31-19.3 31-43.9C81 22.5 67.1 9 50 9Z"
        fill="currentColor"
      />
      <circle cx="50" cy="39" r="10.5" fill="#252bae" />
    </svg>
  );
}

function LockIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`${className} shrink-0`} aria-hidden>
      <rect x="14" y="28" width="36" height="28" rx="5" fill="currentColor" />
      <path
        d="M22 28v-7a10 10 0 0120 0v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="42" r="4" fill="#1e2aab" />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <NewsletterSignup />
      <footer id="footer" className="w-full bg-[#252bae] text-white">
        <div className="ph-condensed mx-auto grid max-w-[860px] grid-cols-[1.08fr_1.16fr_1fr] gap-x-3 px-5 py-6 text-[7.2px] font-bold leading-[1.15] min-[700px]:gap-x-8 min-[700px]:px-10 min-[700px]:py-7 min-[700px]:text-[12px] lg:hidden">
          <div className="min-w-0">
            <div className="relative h-[38px] w-[132px] overflow-hidden min-[700px]:h-[64px] min-[700px]:w-[218px]">
              <Image
                src="/brand/logo-ph-plus-figma.png"
                alt="PH PLUS"
                width={295}
                height={123}
                className="h-full w-full object-contain object-left"
              />
            </div>

            <div className="mt-3 flex items-center gap-2 min-[700px]:mt-5 min-[700px]:gap-3">
              <Image
                src="/home/icon-invima.png"
                alt="INVIMA"
                width={96}
                height={70}
                className="h-[42px] w-[58px] shrink-0 bg-white object-contain min-[700px]:h-[80px] min-[700px]:w-[112px]"
              />
              <div className="min-w-0 leading-[1.13]">
                <p>Registro sanitario INVIMA</p>
                <p>RSA: 0030646-2024</p>
                <p>RSA-0024829-2023</p>
              </div>
            </div>

            <div className="mt-4 leading-[1.2] min-[700px]:mt-5">
              <p>Lunes a viernes: 8 am - 5pm</p>
              <p>info@aguaphplus.com</p>
              <p>whatsapp: +57 3234392470</p>
            </div>
          </div>

          <div className="min-w-0 pt-7 min-[700px]:pt-10">
            <div className="flex items-start gap-1.5 min-[700px]:gap-4">
              <PinIcon className="h-[18px] w-[18px] min-[700px]:h-[34px] min-[700px]:w-[34px]" />
              <div className="min-w-0">
                <p>
                  Av km 1,5 vía Siberia, Parque Agroindustrial de Occidente,
                  Bodega 2 local 78, Cota - Cundinamarca
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block hover:underline min-[700px]:mt-2"
                >
                  Ver en Google Maps
                </a>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-1.5 leading-none min-[700px]:mt-12 min-[700px]:gap-4">
              <LockIcon className="h-[18px] w-[18px] min-[700px]:h-[34px] min-[700px]:w-[34px]" />
              <div className="min-w-0">
                <p>Pagos seguros SSL</p>
                <Image
                  src="/footer/payment-badges.png"
                  alt="Visa, Mastercard y PSE"
                  width={293}
                  height={53}
                  className="mt-1 h-auto w-[92px] object-contain min-[700px]:mt-2 min-[700px]:w-[178px]"
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 pt-7 text-right min-[700px]:pt-10">
            <nav className="flex flex-col gap-0.5 leading-[1.16]" aria-label="Enlaces legales">
              <Link href="/politica-de-privacidad" className="hover:underline">
                Política de Privacidad
              </Link>
              <Link href="/terminos-y-condiciones" className="hover:underline">
                Términos y Condiciones
              </Link>
              <Link href="/politica-de-cambios" className="hover:underline">
                Política de Cambios
              </Link>
            </nav>
            <div className="mt-6 leading-[1.16] min-[700px]:mt-9">
              <p>Agua PH PLUS © 2026</p>
              <p>Todos los derechos reservados</p>
              <p>NIT: 901.219.610.3</p>
            </div>
            <div className="mt-4 flex justify-end min-[700px]:mt-7">
              <SocialLinks compact />
            </div>
          </div>
        </div>

        <div
          className="ph-condensed relative mx-auto hidden max-w-[2048px] lg:block"
          style={{ height: "clamp(360px, 25vw, 512px)" }}
        >
          <div
            className="absolute overflow-hidden"
            style={{
              left: "clamp(60px, 4.2vw, 86px)",
              top: "0px",
              height: "clamp(96px, 6.4vw, 132px)",
              width: "clamp(320px, 22vw, 455px)",
            }}
          >
            <Image
              src="/brand/logo-ph-plus-figma.png"
              alt="PH PLUS"
              width={441}
              height={130}
              className="absolute top-0 h-auto"
              style={{
                left: "clamp(-94px, -4.6vw, -66px)",
                width: "clamp(320px, 22vw, 455px)",
              }}
            />
          </div>

          <p
            className="absolute max-w-[320px] text-[22px] font-bold leading-[1.22]"
            style={{
              left: "clamp(60px, 4.2vw, 86px)",
              top: "clamp(130px, 9.1vw, 186px)",
            }}
          >
            Cuidarte empieza por lo que eliges cada día
          </p>

          <div
            className="absolute whitespace-pre-line text-[18px] font-bold leading-[1.32]"
            style={{
              left: "clamp(60px, 4.2vw, 86px)",
              top: "clamp(238px, 16.3vw, 334px)",
            }}
          >
            <p>Lunes a viernes: 8 am - 5pm</p>
            <p>info@aguaphplus.com</p>
            <p>whatsapp: +57 3234392470</p>
          </div>

          <div
            className="absolute flex items-start gap-7 text-[18px] font-bold leading-[1.28]"
            style={{
              left: "clamp(522px, 38.2vw, 782px)",
              top: "clamp(108px, 7.6vw, 156px)",
            }}
          >
            <PinIcon className="h-[58px] w-[58px]" />
            <div>
              <p>
                Av km 1,5 vía Siberia, Parque
                <br />
                Agroindustrial de Occidente, Bodega 2
                <br />
                local 78, Cota - Cundinamarca
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block hover:underline"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>

          <div
            className="absolute flex items-start gap-7 text-[18px] font-bold leading-[1.28]"
            style={{
              left: "clamp(522px, 38.2vw, 782px)",
              top: "clamp(240px, 16.8vw, 344px)",
            }}
          >
            <LockIcon className="h-[58px] w-[58px]" />
            <div>
              <p>Pagos seguros SSL</p>
              <Image
                src="/footer/payment-badges.png"
                alt="Visa, Mastercard y PSE"
                width={811}
                height={148}
                className="mt-3 h-auto w-[215px] object-contain"
              />
            </div>
          </div>

          <nav
            className="absolute flex w-[280px] flex-col items-center gap-1.5 text-center text-[18px] font-bold leading-[1.32]"
            style={{
              right: "clamp(60px, 4.2vw, 86px)",
              top: "clamp(92px, 6.5vw, 133px)",
            }}
            aria-label="Enlaces legales"
          >
            <Link href="/politica-de-privacidad" className="hover:underline">
              Política de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="hover:underline">
              Términos y Condiciones
            </Link>
            <Link href="/politica-de-cambios" className="hover:underline">
              Política de Cambios
            </Link>
          </nav>

          <div
            className="absolute w-[280px] text-center text-[18px] font-bold leading-[1.32]"
            style={{
              right: "clamp(60px, 4.2vw, 86px)",
              top: "clamp(210px, 14.7vw, 301px)",
            }}
          >
            <p>Agua PH PLUS © 2026</p>
            <p>Todos los derechos reservados</p>
            <p>NIT: 901.219.610.3</p>
          </div>

          <div
            className="absolute w-[280px]"
            style={{
              right: "clamp(60px, 4.2vw, 86px)",
              top: "clamp(292px, 20.4vw, 418px)",
            }}
          >
            <div className="flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
