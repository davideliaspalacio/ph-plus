import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PH PLUS — Hidratación consciente para ti y los tuyos",
  description:
    "Agua PH 9 que equilibra tu cuerpo. Hidratación más rápida, con calcio y magnesio, libre de BPA. Compra fácil por WhatsApp y recíbelo en casa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="flex min-h-dvh flex-col bg-white text-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
