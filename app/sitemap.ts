import type { MetadataRoute } from "next";

import { productRepo } from "@/src/features/catalog";

import { SITE_URL } from "./lib/site";

// Se regenera por petición (cacheado por el CDN): los productos salen de la DB.
export const dynamic = "force-dynamic";

const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/productos", priority: 0.9 },
  { path: "/por-que-ph-plus", priority: 0.7 },
  { path: "/puntos-de-venta", priority: 0.6 },
  { path: "/envios", priority: 0.6 },
  { path: "/politica-de-cambios", priority: 0.2 },
  { path: "/politica-de-privacidad", priority: 0.2 },
  { path: "/terminos-y-condiciones", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.path === "" || r.path === "/productos" ? "weekly" : "monthly",
    priority: r.priority,
  }));

  try {
    const { items } = await productRepo.list({ perPage: 500 });
    for (const p of items) {
      entries.push({
        url: `${SITE_URL}/productos/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (error) {
    // Un fallo de DB no debe tumbar el sitemap: se sirve al menos lo estático.
    console.error("[sitemap] no se pudieron leer los productos:", error);
  }

  return entries;
}
