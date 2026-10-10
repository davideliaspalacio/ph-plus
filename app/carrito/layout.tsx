import type { Metadata } from "next";

// Área privada / transaccional: no tiene valor para buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
