/**
 * Reglas de validación de credenciales.
 *
 * - Email con formato RFC básico (z.string().email()).
 * - Password ≥ 8 chars y al menos un número (FUNCTIONAL-SPEC §8).
 */

import { z } from "zod";

export const EmailSchema = z
  .string()
  .trim()
  .min(1, "Email requerido")
  .email("Email inválido");

export const PasswordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/\d/, "Debe incluir al menos un número");

export const LoginCredentialsSchema = z.object({
  email: EmailSchema,
  /** En login no exigimos la regla fuerte: si la pass viejo era débil igual debería loguearse. */
  password: z.string().min(1, "Password requerido"),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const SignupInputSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z.string().trim().min(1, "Nombre requerido"),
  acceptsTerms: z.literal(true, { message: "Debes aceptar los términos" }),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;
