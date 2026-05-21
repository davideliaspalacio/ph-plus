import { describe, expect, it } from "vitest";
import { toSlug } from "./slug";

describe("toSlug", () => {
  it("kebab-case básico", () => {
    expect(toSlug("Botellon 19L Premium")).toBe("botellon-19l-premium");
  });

  it("acentos y caracteres especiales", () => {
    expect(toSlug("Botellón 19L Premium!")).toBe("botellon-19l-premium");
    expect(toSlug("Ñoño Camión")).toBe("nono-camion");
    expect(toSlug("café crème")).toBe("cafe-creme");
  });

  it("colapsa espacios y guiones múltiples", () => {
    expect(toSlug("  hola   mundo ")).toBe("hola-mundo");
    expect(toSlug("a---b__c   d")).toBe("a-b-c-d");
  });

  it("trim de dashes en bordes", () => {
    expect(toSlug("---hola---")).toBe("hola");
    expect(toSlug("!@#hola!@#")).toBe("hola");
  });

  it("strings vacíos o todo no-alfanumérico", () => {
    expect(toSlug("")).toBe("");
    expect(toSlug("   ")).toBe("");
    expect(toSlug("!@#$%")).toBe("");
  });

  it("preserva dígitos", () => {
    expect(toSlug("Pack 6 garrafas 1.5L")).toBe("pack-6-garrafas-1-5l");
  });

  it("idempotente sobre un slug ya válido", () => {
    expect(toSlug("botellon-19l-premium")).toBe("botellon-19l-premium");
  });
});
