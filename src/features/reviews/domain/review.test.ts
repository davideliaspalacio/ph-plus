import { describe, expect, it } from "vitest";
import { ReviewSchema, ReviewStatusSchema } from "./review";

/**
 * Tests del schema Zod de Review: rangos, mínimos, enum de status, happy path.
 */

const baseInput = {
  id: "r1",
  productSlug: "camisa-azul",
  authorName: "Juan",
  rating: 5,
  title: "Excelente",
  text: "Producto cumple lo prometido.",
  recommends: true,
  status: "pending" as const,
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T10:00:00.000Z",
};

describe("ReviewSchema", () => {
  it("acepta un review válido con los campos requeridos", () => {
    const parsed = ReviewSchema.parse(baseInput);
    expect(parsed.id).toBe("r1");
    expect(parsed.productSlug).toBe("camisa-azul");
    expect(parsed.rating).toBe(5);
    expect(parsed.status).toBe("pending");
    expect(parsed.recommends).toBe(true);
  });

  it("rechaza rating fuera del rango 1..5", () => {
    expect(() => ReviewSchema.parse({ ...baseInput, rating: 0 })).toThrow();
    expect(() => ReviewSchema.parse({ ...baseInput, rating: 6 })).toThrow();
    expect(() => ReviewSchema.parse({ ...baseInput, rating: -1 })).toThrow();
  });

  it("rechaza rating no entero", () => {
    expect(() => ReviewSchema.parse({ ...baseInput, rating: 3.5 })).toThrow();
  });

  it("rechaza text con menos de 10 caracteres", () => {
    expect(() => ReviewSchema.parse({ ...baseInput, text: "corto" })).toThrow();
    expect(() => ReviewSchema.parse({ ...baseInput, text: "exactly9!" })).toThrow();
    const ok = ReviewSchema.parse({ ...baseInput, text: "1234567890" });
    expect(ok.text).toBe("1234567890");
  });

  it("acepta los tres status válidos y rechaza otros", () => {
    for (const status of ["pending", "approved", "rejected"] as const) {
      const parsed = ReviewSchema.parse({ ...baseInput, status });
      expect(parsed.status).toBe(status);
    }
    expect(() =>
      ReviewSchema.parse({ ...baseInput, status: "spam" }),
    ).toThrow();
  });

  it("permite campos opcionales (userId, photo, rejectionReason, adminResponse)", () => {
    const full = ReviewSchema.parse({
      ...baseInput,
      userId: "u1",
      photo: "https://example.com/p.jpg",
      status: "rejected",
      rejectionReason: "Off-topic",
      adminResponse: "Gracias por tu opinión",
    });
    expect(full.userId).toBe("u1");
    expect(full.photo).toBe("https://example.com/p.jpg");
    expect(full.rejectionReason).toBe("Off-topic");
    expect(full.adminResponse).toBe("Gracias por tu opinión");
  });

  it("ReviewStatusSchema expone exactamente los 3 valores", () => {
    expect(ReviewStatusSchema.parse("pending")).toBe("pending");
    expect(ReviewStatusSchema.parse("approved")).toBe("approved");
    expect(ReviewStatusSchema.parse("rejected")).toBe("rejected");
    expect(() => ReviewStatusSchema.parse("draft")).toThrow();
  });
});
