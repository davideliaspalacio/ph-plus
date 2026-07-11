/**
 * Seed inicial de la configuración de la tienda (FUNCTIONAL-SPEC §25).
 *
 * El repo mock de `admin/settings` (cuando exista) cargará este objeto si su
 * namespace de `localStorage` está vacío. El shape `SeedStoreSettings` se
 * define inline para evitar acoplar mocks a la feature antes de tiempo.
 *
 * Aligns with `features/admin/settings` (cuando se cree).
 */

export type SeedPaymentMethod =
  | "credit_card"
  | "pse"
  | "nequi"
  | "cash_on_delivery"
  | "payu";

export type SeedStoreSettings = {
  businessName: string;
  /** NIT con dígito de verificación. */
  nit: string;
  phone: string;
  whatsapp: string;
  /** Tasa de IVA aplicada (0 = exento). */
  taxRate: number;
  paymentMethods: SeedPaymentMethod[];
  policies: {
    /** Ruta interna a la página de envíos. */
    shipping: string;
    /** Ruta interna a la página de devoluciones. */
    returns: string;
  };
};

export const SETTINGS_SEED: SeedStoreSettings = {
  businessName: "PH PLUS",
  nit: "900.123.456-7",
  phone: "+57 323 439 2470",
  whatsapp: "+57 323 439 2470",
  taxRate: 0,
  paymentMethods: ["payu", "credit_card", "pse", "nequi", "cash_on_delivery"],
  policies: {
    shipping: "/envios",
    returns: "/devoluciones",
  },
};
