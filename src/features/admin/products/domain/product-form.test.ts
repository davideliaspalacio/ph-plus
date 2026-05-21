import { describe, expect, it } from "vitest";
import { ProductFormSchema } from "./product-form";

const baseInput = {
  slug: "botellon-19l",
  title: "Botellón 19 L",
  shortTitle: "Botellón 19 L",
  tagline: "Hidratación premium",
  description: "Agua alcalina PH 9 lista para servir.",
  priceValue: 36000,
  category: "botellon" as const,
  size: "19L" as const,
  visualKey: "garrafas" as const,
  popularity: 75,
  isActive: true,
};

describe("ProductFormSchema", () => {
  it("acepta input válido y devuelve los mismos valores", () => {
    const result = ProductFormSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("botellon-19l");
      expect(result.data.title).toBe("Botellón 19 L");
    }
  });

  it("normaliza el slug a kebab-case si viene raw", () => {
    const result = ProductFormSchema.safeParse({
      ...baseInput,
      slug: "Botellón 19L Premium!",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("botellon-19l-premium");
    }
  });

  it("rechaza title con menos de 3 caracteres", () => {
    const result = ProductFormSchema.safeParse({ ...baseInput, title: "ab" });
    expect(result.success).toBe(false);
  });

  it("rechaza priceValue negativo", () => {
    const result = ProductFormSchema.safeParse({
      ...baseInput,
      priceValue: -1,
    });
    expect(result.success).toBe(false);
  });

  it("acepta priceValue = 0", () => {
    const result = ProductFormSchema.safeParse({
      ...baseInput,
      priceValue: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza prevPriceValue <= priceValue", () => {
    const result = ProductFormSchema.safeParse({
      ...baseInput,
      priceValue: 50000,
      prevPriceValue: 50000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("prevPriceValue"),
      );
      expect(issue).toBeDefined();
    }
  });

  it("acepta prevPriceValue > priceValue", () => {
    const result = ProductFormSchema.safeParse({
      ...baseInput,
      priceValue: 40000,
      prevPriceValue: 50000,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza popularity fuera de 0..100", () => {
    expect(
      ProductFormSchema.safeParse({ ...baseInput, popularity: -1 }).success,
    ).toBe(false);
    expect(
      ProductFormSchema.safeParse({ ...baseInput, popularity: 101 }).success,
    ).toBe(false);
    expect(
      ProductFormSchema.safeParse({ ...baseInput, popularity: 50 }).success,
    ).toBe(true);
  });

  it("rechaza slug que normaliza a vacío", () => {
    const result = ProductFormSchema.safeParse({ ...baseInput, slug: "!!!" });
    expect(result.success).toBe(false);
  });
});
