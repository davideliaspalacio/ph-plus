import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Áreas privadas o sin valor para buscadores.
        disallow: [
          "/admin",
          "/api/",
          "/auth/",
          "/carrito",
          "/checkout",
          "/cuenta",
          "/login",
          "/registro",
          "/pedido/",
          "/buscar",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
