import Image from "next/image";
import Link from "next/link";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Av%20km%201.5%20via%20Siberia%20Parque%20Agroindustrial%20de%20Occidente%20Bodega%202%20local%2078%20Cota%20Cundinamarca";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aguaphplus",
    icon: "instagram",
    className:
      "bg-linear-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/aguaphplus",
    icon: "facebook",
    className: "bg-[#1877f2]",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@aguaphplus",
    icon: "youtube",
    className: "bg-[#ff0000]",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aguaphplus",
    icon: "tiktok",
    className: "bg-[#050505]",
  },
];

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-[70%] w-[70%]" aria-hidden>
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="16.7" cy="7.3" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-[74%] w-[74%]" aria-hidden>
        <path
          fill="currentColor"
          d="M14.2 8.2h2.1V4.7c-.4 0-1.6-.1-3-.1-3 0-5 1.8-5 5.2v2.9H5v3.9h3.3V24h4.1v-7.4h3.3l.5-3.9h-3.8v-2.5c0-1.1.3-2 1.8-2Z"
        />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-[78%] w-[78%]" aria-hidden>
        <path
          fill="currentColor"
          d="M9 7.2v9.6l8.3-4.8L9 7.2Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-[74%] w-[74%]" aria-hidden>
      <path
        fill="currentColor"
        d="M16.6 5.1c-.9-.6-1.5-1.6-1.7-2.8h-3.3v13.2a2.8 2.8 0 1 1-2-2.7V9.4a6.2 6.2 0 1 0 5.3 6.1V8.8a8 8 0 0 0 4.6 1.5V7a4.7 4.7 0 0 1-2.9-1.9Z"
      />
    </svg>
  );
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center ${compact ? "gap-1.5" : "gap-3"}`}
      aria-label="Redes sociales de PH PLUS"
    >
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${social.label} de PH PLUS`}
          className={
            "grid shrink-0 place-items-center rounded-[8px] text-white shadow-[0_2px_5px_rgba(0,0,0,0.25)] ring-1 ring-white/10 transition-transform hover:-translate-y-0.5 " +
            social.className +
            (compact ? " h-[17px] w-[17px]" : " h-[38px] w-[38px]")
          }
        >
          <SocialIcon icon={social.icon} />
        </a>
      ))}
    </div>
  );
}

function PinIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} aria-hidden>
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 6.5 8 12 8 12s8-5.5 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
        fill="currentColor"
      />
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
    <footer className="w-full bg-[#1e2aab] text-white">
      <div className="ph-condensed relative mx-auto h-[154px] max-w-[430px] overflow-hidden px-4 lg:hidden">
        <Image
          src="/brand/logo-ph-plus-figma.png"
          alt="PH PLUS"
          width={160}
          height={48}
          className="absolute left-[14px] top-[14px] h-[34px] w-[132px] object-contain"
        />

        <Image
          src="/home/icon-invima.png"
          alt="INVIMA"
          width={58}
          height={42}
          className="absolute left-[14px] top-[58px] h-[42px] w-[58px] bg-white object-contain"
        />
        <div className="absolute left-[78px] top-[61px] w-[118px] text-[7.5px] font-bold leading-[1.12]">
          <p>Registro sanitario INVIMA</p>
          <p>RSA: 0030646-2024</p>
          <p>RSA-0024829-2023</p>
        </div>
        <div className="absolute left-[14px] top-[111px] w-[150px] text-[7.5px] font-bold leading-[1.18]">
          <p>Lunes a viernes: 8 am - 5pm</p>
          <p>info@aguaphplus.com</p>
          <p>whatsapp: +57 3234392470</p>
        </div>

        <div className="absolute left-[190px] top-[34px] flex w-[128px] gap-1.5 text-[7px] font-bold leading-[1.12]">
          <PinIcon className="h-[20px] w-[20px]" />
          <div>
            <p>
              Av km 1,5 vía Siberia, Parque Agroindustrial de Occidente,
              Bodega 2 local 78, Cota - Cundinamarca
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block hover:underline"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
        <div className="absolute left-[190px] top-[111px] flex items-start gap-1.5 text-[7px] font-bold leading-none">
          <LockIcon className="h-[20px] w-[20px]" />
          <div>
            <p>Pagos seguros SSL</p>
            <Image
              src="/footer/payment-badges.png"
              alt="Visa, Mastercard y PSE"
              width={293}
              height={53}
              className="mt-1 h-auto w-[92px] object-contain"
            />
          </div>
        </div>

        <div className="absolute right-[14px] top-[34px] text-right text-[7px] font-bold leading-[1.16]">
          <Link href="/politica-de-privacidad" className="block hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/terminos-y-condiciones" className="block hover:underline">
            Términos y Condiciones
          </Link>
          <Link href="/politica-de-cambios" className="block hover:underline">
            Política de Cambios
          </Link>
        </div>
        <div className="absolute right-[14px] top-[76px] text-right text-[7px] font-bold leading-[1.16]">
          <p>Agua PH PLUS © 2026</p>
          <p>Todos los derechos reservados</p>
          <p>NIT: 901.219.610.3</p>
        </div>
        <div className="absolute right-[14px] top-[116px]">
          <SocialLinks compact />
        </div>
      </div>

      <div className="ph-condensed mx-auto hidden min-h-[270px] max-w-[1280px] grid-cols-[410px_1fr_330px] items-center gap-9 px-10 py-8 lg:grid">
        <div className="flex flex-col">
          <Image
            src="/brand/logo-ph-plus-figma.png"
            alt="PH PLUS"
            width={441}
            height={130}
            className="h-auto w-[330px]"
          />
          <div className="mt-8 flex items-center gap-5">
            <Image
              src="/home/icon-invima.png"
              alt="INVIMA"
              width={95}
              height={90}
              className="h-[90px] w-[95px] bg-white object-contain"
            />
            <div className="text-[22px] font-bold leading-[1.24]">
              <p>Registro sanitario INVIMA</p>
              <p>RSA: 0030646-2024</p>
              <p>RSA-0024829-2023</p>
            </div>
          </div>
          <div className="mt-8 whitespace-pre-line text-[22px] font-bold leading-[1.28]">
            <p>Lunes a viernes: 8 am - 5pm</p>
            <p>info@aguaphplus.com</p>
            <p>whatsapp: +57 3234392470</p>
          </div>
        </div>

        <div className="flex flex-col justify-center text-[23px] font-bold leading-[1.28]">
          <div className="flex items-start gap-8">
            <PinIcon className="h-[72px] w-[72px]" />
            <div>
              <p className="max-w-[490px]">
                Av km 1,5 vía Siberia, Parque Agroindustrial de Occidente,
                Bodega 2 local 78, Cota - Cundinamarca
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

          <div className="mt-9 flex items-start gap-8">
            <LockIcon className="h-[72px] w-[72px]" />
            <div>
              <p>Pagos seguros SSL</p>
              <Image
                src="/footer/payment-badges.png"
                alt="Visa, Mastercard y PSE"
                width={293}
                height={53}
                className="mt-3 h-auto w-[265px] object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col text-left text-[23px] font-bold leading-[1.3] md:col-span-2 lg:col-span-1 lg:items-end lg:justify-center lg:text-right">
          <Link href="/politica-de-privacidad" className="hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/terminos-y-condiciones" className="hover:underline">
            Términos y Condiciones
          </Link>
          <Link href="/politica-de-cambios" className="hover:underline">
            Política de Cambios
          </Link>

          <div className="mt-8">
            <p>Agua PH PLUS © 2026</p>
            <p>Todos los derechos reservados</p>
            <p>NIT: 901.219.610.3</p>
          </div>

          <div className="mt-5">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
