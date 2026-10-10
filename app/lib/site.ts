/**
 * URL canónica pública del sitio (sin barra final).
 *
 * A propósito NO sale de NEXT_PUBLIC_SITE_URL: esa variable se usa para otros
 * fines (retorno de pasarelas) y en algunos entornos trae un dominio de
 * ejemplo o `*.vercel.app`; si se colara acá, el canonical, el sitemap y los
 * datos estructurados apuntarían a un dominio equivocado y Google indexaría
 * duplicados. El dominio de producción es uno solo.
 */
export const SITE_URL = "https://www.aguaphplus.com";

export const SITE_NAME = "PH PLUS";
export const SITE_DESCRIPTION =
  "Agua alcalina PH 9 con calcio y magnesio, filtrada en 14 procesos y libre de BPA. Botellones, garrafas y presentaciones PET con domicilio en Bogotá, Medellín, Barranquilla, Cartagena y Cali.";
