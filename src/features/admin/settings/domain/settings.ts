import { z } from "zod";

/**
 * Schema de la configuración global de la tienda (FUNCTIONAL-SPEC §25).
 *
 * Cubre datos del negocio, métodos de pago activos, % de IVA y rutas a las
 * páginas de políticas. El día que migremos a un backend real, una
 * `SupabaseSettingsRepo` lo cumple sin tocar la UI.
 */

export const StorePoliciesSchema = z.object({
  /** Ruta interna a la página de envíos. */
  shipping: z.string().min(1),
  /** Ruta interna a la página de devoluciones. */
  returns: z.string().min(1),
});

export type StorePolicies = z.infer<typeof StorePoliciesSchema>;

export const SettingsSchema = z.object({
  businessName: z.string().min(1),
  /** NIT con dígito de verificación. */
  nit: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  address: z.string().optional(),
  /** Tasa de IVA aplicada en proporción 0..1 (0 = exento). */
  taxRate: z.number().min(0).max(1),
  paymentMethods: z.array(z.string().min(1)),
  policies: StorePoliciesSchema,
});

export type Settings = z.infer<typeof SettingsSchema>;

export type SettingsPatch = Partial<Settings>;
