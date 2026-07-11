import { z } from "zod";

/**
 * Schemas de dominio del formulario de checkout.
 *
 * Cada sección del form tiene su propio schema (Contact / ShippingAddress /
 * Payment) y `CheckoutFormSchema` los compone. Las reglas validan formatos
 * "del mundo real" — email, teléfono colombiano con al menos 7 dígitos, etc.
 *
 * Estos schemas alimentan la validación inline del form (vía `safeParse` en
 * blur) y son la fuente de verdad de los tipos de datos que viajan al
 * `orderRepo.create`.
 */

/* ---------- Catálogos ---------- */

export const COLOMBIAN_DEPARTMENTS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
  "Bogotá D.C.",
] as const;

export const PAYMENT_METHODS = [
  "credit_card",
  "pse",
  "nequi",
  "cash_on_delivery",
  "payu",
] as const;

export type CheckoutPaymentMethod = (typeof PAYMENT_METHODS)[number];

/* ---------- Reglas reutilizables ---------- */

const phoneRegex = /^[\d\s+()-]+$/;

const phoneSchema = z
  .string()
  .min(1, "Ingresa tu teléfono")
  .refine((v) => phoneRegex.test(v), "Teléfono no válido")
  .refine(
    (v) => v.replace(/\D/g, "").length >= 7,
    "Teléfono debe tener al menos 7 dígitos",
  );

/* ---------- Contact ---------- */

export const ContactSchema = z.object({
  name: z.string().min(1, "Ingresa tu nombre completo"),
  email: z.string().email("Email no válido"),
  phone: phoneSchema,
});

export type ContactInput = z.infer<typeof ContactSchema>;

/* ---------- Shipping Address ---------- */

export const ShippingAddressSchema = z.object({
  address: z.string().min(1, "Ingresa una dirección"),
  city: z.string().min(1, "Ingresa tu ciudad"),
  department: z
    .enum(COLOMBIAN_DEPARTMENTS)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;

/* ---------- Payment ---------- */

export const PaymentSchema = z
  .object({
    method: z.enum(PAYMENT_METHODS, {
      message: "Selecciona un método de pago",
    }),
    card4Last: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.method === "credit_card" && val.card4Last) {
      if (!/^\d{4}$/.test(val.card4Last)) {
        ctx.addIssue({
          code: "custom",
          path: ["card4Last"],
          message: "Últimos 4 dígitos deben ser numéricos",
        });
      }
    }
  });

export type PaymentInput = z.infer<typeof PaymentSchema>;

/* ---------- Formulario completo ---------- */

export const CheckoutFormSchema = z.object({
  contact: ContactSchema,
  shipping: ShippingAddressSchema,
  payment: PaymentSchema,
});

export type CheckoutFormInput = z.infer<typeof CheckoutFormSchema>;
