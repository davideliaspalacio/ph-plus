import Image from "next/image";
import Link from "next/link";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 shrink-0" aria-hidden>
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 6.5 8 12 8 12s8-5.5 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden>
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
      <div className="ph-condensed mx-auto grid max-w-[1180px] grid-cols-1 gap-9 px-5 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-[360px_1fr_300px] lg:gap-10 lg:px-6 lg:py-10">
        <div className="flex flex-col">
          <Image
            src="/brand/logo-ph-plus-figma.png"
            alt="PH PLUS"
            width={441}
            height={130}
            className="h-auto w-[260px] lg:w-[300px]"
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
              <a href="#" className="mt-2 inline-block hover:underline">
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

          <Image
            src="/footer/social-icons.png"
            alt="Instagram, Facebook, YouTube y TikTok"
            width={208}
            height={62}
            className="mt-3 h-auto w-[150px] object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
