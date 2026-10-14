import { describe, expect, it } from "vitest";

import {
  isFullName,
  normalizeDocumentNumber,
  normalizeMobile,
  validateDocument,
} from "./customer-data";

describe("isFullName", () => {
  it("rechaza un solo nombre o vacío", () => {
    expect(isFullName("")).toBe(false);
    expect(isFullName("   ")).toBe(false);
    expect(isFullName("Patricia")).toBe(false);
  });

  it("acepta nombre y apellido, con espacios extra y acentos", () => {
    expect(isFullName("Patricia Londoño")).toBe(true);
    expect(isFullName("  María   José  Pérez ")).toBe(true);
    expect(isFullName("Ñandú Ávila")).toBe(true);
  });

  it("no cuenta iniciales sueltas como palabra", () => {
    expect(isFullName("Patricia L")).toBe(false);
    expect(isFullName("Patricia L.")).toBe(false);
  });
});

describe("validateDocument", () => {
  it("CC/CE: sólo dígitos de 5 a 12, ignorando puntos y espacios", () => {
    expect(validateDocument("CC", "66.658.551")).toBeNull();
    expect(validateDocument("CC", "66 658 551")).toBeNull();
    expect(validateDocument("CE", "1234567890")).toBeNull();
    expect(validateDocument("CC", "1234")).not.toBeNull();
    expect(validateDocument("CC", "12345678901234")).not.toBeNull();
    expect(validateDocument("CC", "66AB5855")).not.toBeNull();
  });

  it("NIT: con o sin dígito de verificación", () => {
    expect(validateDocument("NIT", "901219610")).toBeNull();
    expect(validateDocument("NIT", "901.219.610-3")).toBeNull();
    expect(validateDocument("NIT", "90121")).not.toBeNull();
    expect(validateDocument("NIT", "901219610-33")).not.toBeNull();
  });

  it("Pasaporte: alfanumérico de 5 a 15, sin importar mayúsculas", () => {
    expect(validateDocument("PASAPORTE", "ab123456")).toBeNull();
    expect(validateDocument("PASAPORTE", "A1")).not.toBeNull();
    expect(validateDocument("PASAPORTE", "AB-123456")).not.toBeNull();
  });

  it("vacío siempre es error", () => {
    expect(validateDocument("CC", "  ")).toBe("Ingresa tu número de documento");
  });

  it("normaliza el número guardado", () => {
    expect(normalizeDocumentNumber("CC", "66.658.551")).toBe("66658551");
    expect(normalizeDocumentNumber("PASAPORTE", "ab 123")).toBe("AB123");
  });
});

describe("normalizeMobile", () => {
  it("acepta 10 dígitos con formato, y el prefijo +57", () => {
    expect(normalizeMobile("300 123 4567")).toBe("3001234567");
    expect(normalizeMobile("+57 (300) 123-4567")).toBe("3001234567");
    expect(normalizeMobile("573001234567")).toBe("3001234567");
  });

  it("rechaza fijos, cortos y que no empiecen por 3", () => {
    expect(normalizeMobile("6011234567")).toBeNull();
    expect(normalizeMobile("300123")).toBeNull();
    expect(normalizeMobile("")).toBeNull();
  });
});
