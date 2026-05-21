import Image from "next/image";
import Link from "next/link";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 6.5 8 12 8 12s8-5.5 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
        fill="currentColor"
      />
    </svg>
  );
}

function Social({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-brand text-white">
      <div className="mx-auto grid max-w-page grid-cols-1 gap-10 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:px-12">
        <div className="flex flex-col gap-5">
          <Image
            src="/brand/logo-ph-plus.png"
            alt="PH PLUS"
            width={170}
            height={50}
            className="h-11 w-auto sm:h-12"
          />
          <p className="text-[14px] font-medium">
            Cuidarte empieza por lo que eliges cada día
          </p>
          <div className="mt-2 space-y-1.5 text-[13px]">
            <p>Lunes a viernes: 8 am - 5pm</p>
            <p>info@aguaphplus.com</p>
            <p>whatsapp: +57 3234392470</p>
          </div>
        </div>

        <div className="text-[13px]">
          <p className="text-[15px] font-semibold">Contacto</p>
          <div className="mt-4 flex items-start gap-2">
            <PinIcon />
            <p className="leading-normal">
              Av km 1,5 vía Siberia, Parque Agroindustrial de Occidente,
              Bodega 2 local 78, Cota - Cundinamarca
            </p>
          </div>
          <a
            href="#"
            className="mt-2 inline-block underline-offset-2 hover:underline"
          >
            Ver en Google Maps
          </a>

          <p className="mt-6 font-semibold">Pagos seguros SLL</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="grid h-7 w-12 place-items-center rounded bg-white text-[11px] font-bold text-[#1a1f71]">
              VISA
            </span>
            <span className="grid h-7 w-12 place-items-center rounded bg-white text-[10px] font-bold text-[#eb001b]">
              ●●
            </span>
            <span className="grid h-7 w-12 place-items-center rounded bg-white text-[11px] font-bold text-brand">
              pse
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-left text-[13px] md:col-span-2 lg:col-span-1 lg:text-right">
          <Link href="/envios" className="hover:underline">
            Envíos y tiempos de entrega
          </Link>
          <Link href="/productos" className="hover:underline">
            Catálogo de productos
          </Link>
          <a href="#" className="hover:underline">
            Política de Privacidad
          </a>
          <a href="#" className="hover:underline">
            Términos y Condiciones
          </a>
          <a href="#" className="hover:underline">
            Política de Cambios
          </a>

          <div className="mt-6 text-[12px] leading-[1.6]">
            <p>Agua PH PLUS © 2026</p>
            <p>Todos los derechos reservados</p>
            <p>NIT: 901.219.610.3</p>
          </div>

          <div className="mt-4 flex justify-start gap-2 lg:justify-end">
            <Social label="Instagram">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.06 1.8.25 2.22.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.36 1.05.42 2.22.06 1.26.07 1.63.07 4.85s0 3.6-.07 4.85c-.06 1.17-.25 1.8-.42 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.05.36-2.22.42-1.26.06-1.63.07-4.85.07s-3.6 0-4.85-.07c-1.17-.06-1.8-.25-2.22-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.36-1.05-.42-2.22C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.06-1.17.25-1.8.42-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.36 2.22-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.05c-3.7 0-6.75 3.05-6.75 6.75s3.05 6.75 6.75 6.75 6.75-3.05 6.75-6.75S15.7 5.25 12 5.25zm0 11.13c-2.42 0-4.38-1.96-4.38-4.38S9.58 7.62 12 7.62s4.38 1.96 4.38 4.38-1.96 4.38-4.38 4.38zM18.7 6.55a1.58 1.58 0 100-3.15 1.58 1.58 0 000 3.15z" />
              </svg>
            </Social>
            <Social label="Facebook">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.4H7.5V13h2.7v8h3.3z" />
              </svg>
            </Social>
            <Social label="TikTok">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M19.6 7.4a5.7 5.7 0 01-3.4-1.1V15a5 5 0 11-5-5v3a2 2 0 102 2V2.5h3a3.7 3.7 0 003.4 3.4v1.5z" />
              </svg>
            </Social>
          </div>
        </div>
      </div>
    </footer>
  );
}
