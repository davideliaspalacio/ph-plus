import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Panel de administración · PH PLUS" },
  robots: { index: false, follow: false },
};

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
