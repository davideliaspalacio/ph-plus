import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Oswald } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const DEFAULT_TITLE = "PH PLUS — Agua alcalina PH 9 | Hidratación consciente";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | PH PLUS" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "agua alcalina",
    "agua PH 9",
    "agua con calcio y magnesio",
    "agua libre de BPA",
    "botellón 19 litros",
    "agua a domicilio Bogotá",
    "PH PLUS",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE_NAME,
    url: "/",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-logo.png", width: 1200, height: 1200, alt: "PH PLUS" }],
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PH PLUS",
      legalName: "Inversiones PH PLUS S.A.S.",
      url: SITE_URL,
      logo: `${SITE_URL}/og-logo.png`,
      email: "info@aguaphplus.com",
      telephone: "+57 323 439 2470",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Av km 1,5 vía Siberia, Parque Agroindustrial de Occidente, Bodega 2 local 78",
        addressLocality: "Cota",
        addressRegion: "Cundinamarca",
        addressCountry: "CO",
      },
      sameAs: [
        "https://www.instagram.com/aguaphplus",
        "https://www.facebook.com/aguaphplus",
        "https://www.youtube.com/@aguaphplus",
        "https://www.tiktok.com/@aguaphplus",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PH PLUS",
      inLanguage: "es-CO",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${bebasNeue.variable} ${oswald.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-white text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
