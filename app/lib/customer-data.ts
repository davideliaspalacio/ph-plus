/**
 * Datos del cliente que se exigen en el checkout para poder facturar y
 * despachar. Reglas compartidas por el formulario (cliente) y por las rutas de
 * pago (servidor): el servidor es el que manda — el formulario sólo anticipa el
 * error para no hacer esperar al comprador.
 */

export const DOCUMENT_TYPES = [
  { value: "CC", label: "Cédula de ciudadanía (CC)" },
  { value: "CE", label: "Cédula de extranjería (CE)" },
  { value: "NIT", label: "NIT" },
  { value: "PASAPORTE", label: "Pasaporte" },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["value"];

export const DOCUMENT_TYPE_VALUES = DOCUMENT_TYPES.map((d) => d.value) as [
  DocumentType,
  ...DocumentType[],
];

export function documentTypeLabel(type: string | undefined): string {
  return DOCUMENT_TYPES.find((d) => d.value === type)?.value ?? type ?? "";
}

/**
 * Nombre y apellido: al menos dos palabras de 2 o más letras. No se intenta
 * adivinar si "María" o "De la Cruz" son nombre o apellido — sólo se evita que
 * pase un nombre suelto, que es lo que impide facturar.
 */
export function isFullName(value: string): boolean {
  const words = value
    .trim()
    .split(/\s+/)
    .filter((w) => w.replace(/[^\p{L}]/gu, "").length >= 2);
  return words.length >= 2;
}

export const FULL_NAME_ERROR = "Escribe tu nombre completo con apellidos";

/** Normaliza un número de documento: quita espacios, puntos y comas. */
export function normalizeDocumentNumber(type: DocumentType, raw: string): string {
  const compact = raw.trim().replace(/[\s.,]/g, "");
  return type === "PASAPORTE" ? compact.toUpperCase() : compact;
}

/** Devuelve el mensaje de error, o `null` si el documento es válido. */
export function validateDocument(type: DocumentType, raw: string): string | null {
  const value = normalizeDocumentNumber(type, raw);
  if (!value) return "Ingresa tu número de documento";

  switch (type) {
    case "CC":
    case "CE":
      return /^\d{5,12}$/.test(value) ? null : "Ingresa sólo números (de 5 a 12 dígitos)";
    case "NIT":
      // Con o sin dígito de verificación: 900123456 o 900123456-7.
      return /^\d{6,12}(-\d)?$/.test(value)
        ? null
        : "NIT sin puntos, con o sin dígito de verificación (ej. 900123456-7)";
    case "PASAPORTE":
      return /^[A-Z0-9]{5,15}$/.test(value)
        ? null
        : "Pasaporte: de 5 a 15 letras o números, sin espacios";
  }
}

/** Sólo dígitos de un teléfono (quita +, espacios, guiones, paréntesis). */
export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Celular colombiano: 10 dígitos que empiezan por 3, con o sin el prefijo 57.
 * Devuelve el número normalizado de 10 dígitos, o `null` si no es válido.
 */
export function normalizeMobile(raw: string): string | null {
  let digits = phoneDigits(raw);
  if (digits.length === 12 && digits.startsWith("57")) digits = digits.slice(2);
  return /^3\d{9}$/.test(digits) ? digits : null;
}

export const MOBILE_ERROR = "Ingresa un celular de 10 dígitos (ej. 3001234567)";
