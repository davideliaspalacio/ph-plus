import Image from "next/image";
import Link from "next/link";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Av%20km%201.5%20via%20Siberia%20Parque%20Agroindustrial%20de%20Occidente%20Bodega%202%20local%2078%20Cota%20Cundinamarca";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aguaphplus",
    short: "IG",
    className: "bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/aguaphplus",
    short: "f",
    className: "bg-[#1877f2]",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@aguaphplus",
    short: "YT",
    className: "bg-[#ff0000]",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aguaphplus",
    short: "TK",
    className: "bg-black",
  },
];

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${social.label} de PH PLUS`}
          className={
            "grid shrink-0 place-items-center rounded-[5px] font-black text-white transition-transform hover:-translate-y-0.5 " +
            social.className +
            (compact
              ? " h-[13px] min-w-[13px] px-[2px] text-[5px]"
              : " h-8 min-w-8 px-1.5 text-[11px]")
          }
        >
          {social.short}
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
      <div className="ph-condensed relative mx-auto h-[126px] max-w-[390px] overflow-hidden lg:hidden">
        <Image
          src="/brand/logo-ph-plus-figma.png"
          alt="PH PLUS"
          width={160}
          height={48}
          className="absolute left-[18px] top-[13px] h-[30px] w-[112px] object-contain"
        />

        <Image
          src="/home/icon-invima.png"
          alt="INVIMA"
          width={50}
          height={50}
          className="absolute left-2 top-[39px] h-[50px] w-[50px] object-contain"
        />
        <div className="absolute left-[55px] top-[50px] w-[100px] text-[6.5px] font-bold leading-[1.08]">
          <p>Registro sanitario INVIMA</p>
          <p>RSA: 0030646-2024</p>
          <p>RSA-0024829-2023</p>
        </div>
        <div className="absolute left-5 top-[86px] w-[100px] text-[6.5px] font-bold leading-[1.12]">
          <p>Lunes a viernes: 8 am - 5pm</p>
          <p>info@aguaphplus.com</p>
          <p>whatsapp: +57 3234392470</p>
        </div>

        <div className="absolute left-[145px] top-[21px] flex w-[126px] gap-1.5 text-[6.5px] font-bold leading-[1.08]">
          <PinIcon className="h-[17px] w-[17px]" />
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
        <div className="absolute left-[145px] top-[88px] flex items-start gap-1.5 text-[6.5px] font-bold leading-none">
          <LockIcon className="h-[18px] w-[18px]" />
          <div>
            <p>Pagos seguros SSL</p>
            <Image
              src="/footer/payment-badges.png"
              alt="Visa, Mastercard y PSE"
              width={293}
              height={53}
              className="mt-1 h-auto w-[79px] object-contain"
            />
          </div>
        </div>

        <div className="absolute right-[17px] top-[33px] text-right text-[6.5px] font-bold leading-[1.1]">
          <Link href="#" className="block hover:underline">
            Política de Privacidad
          </Link>
          <Link href="#" className="block hover:underline">
            Términos y Condiciones
          </Link>
          <Link href="#" className="block hover:underline">
            Política de Cambios
          </Link>
        </div>
        <div className="absolute right-[17px] top-[63px] text-right text-[6.5px] font-bold leading-[1.1]">
          <p>Agua PH PLUS © 2026</p>
          <p>Todos los derechos reservados</p>
          <p>NIT: 901.219.610.3</p>
        </div>
        <div className="absolute right-[16px] top-[95px]">
          <SocialLinks compact />
        </div>
      </div>

      <div className="ph-condensed mx-auto hidden max-w-[1120px] grid-cols-[310px_1fr_280px] gap-10 px-6 py-9 lg:grid">
        <div className="flex flex-col">
          <Image
            src="/brand/logo-ph-plus-figma.png"
            alt="PH PLUS"
            width={441}
            height={130}
            className="h-auto w-[250px]"
          />
          <p className="mt-4 max-w-[260px] text-[22px] font-bold leading-[1.22]">
            Cuidarte empieza por lo que eliges cada día
          </p>
          <div className="mt-6 whitespace-pre-line text-[18px] font-bold leading-[1.25]">
            <p>Lunes a viernes: 8 am - 5pm</p>
            <p>info@aguaphplus.com</p>
            <p>whatsapp: +57 3234392470</p>
          </div>
        </div>

        <div className="flex flex-col justify-center text-[18px] font-bold leading-[1.22]">
          <div className="flex items-start gap-5">
            <PinIcon />
            <div>
              <p className="max-w-[360px]">
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

          <div className="mt-7 flex items-start gap-5">
            <LockIcon />
            <div>
              <p>Pagos seguros SSL</p>
              <Image
                src="/footer/payment-badges.png"
                alt="Visa, Mastercard y PSE"
                width={293}
                height={53}
                className="mt-2 h-auto w-[230px] object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col text-left text-[18px] font-bold leading-[1.22] md:col-span-2 lg:col-span-1 lg:items-end lg:justify-center lg:text-right">
          <Link href="#" className="hover:underline">
            Política de Privacidad
          </Link>
          <Link href="#" className="hover:underline">
            Términos y Condiciones
          </Link>
          <Link href="#" className="hover:underline">
            Política de Cambios
          </Link>

          <div className="mt-9">
            <p>Agua PH PLUS © 2026</p>
            <p>Todos los derechos reservados</p>
            <p>NIT: 901.219.610.3</p>
          </div>

          <div className="mt-3">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
