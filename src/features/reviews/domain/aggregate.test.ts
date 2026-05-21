import { describe, expect, it } from "vitest";
import { summarizeReviews } from "./aggregate";
import type { Review } from "./review";

/**
 * Tests del agregado: solo cuenta status="approved", calcula promedio
 * (redondeado a 1 decimal), count y distribución por estrellas.
 */

function makeReview(partial: Partial<Review>): Review {
  return {
    id: partial.id ?? "r",
    productSlug: "p1",
    authorName: "X",
    rating: 5,
    title: "T",
    text: "Texto valido del review.",
    recommends: true,
    status: "approved",
    createdAt: "2026-05-20T10:00:00.000Z",
    updatedAt: "2026-05-20T10:00:00.000Z",
    ...partial,
  };
}

describe("summarizeReviews", () => {
  it("lista vacía devuelve average=0, count=0 y distribución en ceros", () => {
    expect(summarizeReviews([])).toEqual({
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });
  });

  it("solo cuenta reviews con status='approved'", () => {
    const reviews = [
      makeReview({ id: "a", rating: 5, status: "approved" }),
      makeReview({ id: "b", rating: 1, status: "pending" }),
      makeReview({ id: "c", rating: 1, status: "rejected" }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.count).toBe(1);
    expect(s.average).toBe(5);
  });

  it("ignora pending y rejected en la distribución", () => {
    const reviews = [
      makeReview({ id: "a", rating: 4, status: "approved" }),
      makeReview({ id: "b", rating: 4, status: "pending" }),
      makeReview({ id: "c", rating: 4, status: "rejected" }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.distribution).toEqual({ 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 });
  });

  it("cuenta correctamente la distribución por estrellas", () => {
    const reviews = [
      makeReview({ id: "1", rating: 5 }),
      makeReview({ id: "2", rating: 5 }),
      makeReview({ id: "3", rating: 4 }),
      makeReview({ id: "4", rating: 3 }),
      makeReview({ id: "5", rating: 1 }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.distribution).toEqual({ 5: 2, 4: 1, 3: 1, 2: 0, 1: 1 });
    expect(s.count).toBe(5);
  });

  it("calcula el average correcto sobre los aprobados", () => {
    const reviews = [
      makeReview({ id: "1", rating: 5 }),
      makeReview({ id: "2", rating: 3 }),
      makeReview({ id: "3", rating: 1 }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.average).toBe(3);
  });

  it("redondea el average a 1 decimal", () => {
    // 5 + 4 + 4 = 13 / 3 = 4.333... → 4.3
    const reviews = [
      makeReview({ id: "1", rating: 5 }),
      makeReview({ id: "2", rating: 4 }),
      makeReview({ id: "3", rating: 4 }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.average).toBe(4.3);
  });

  it("mezcla aprobados y no aprobados: solo los aprobados pesan", () => {
    const reviews = [
      makeReview({ id: "1", rating: 5, status: "approved" }),
      makeReview({ id: "2", rating: 5, status: "approved" }),
      makeReview({ id: "3", rating: 1, status: "pending" }),
      makeReview({ id: "4", rating: 1, status: "rejected" }),
    ];
    const s = summarizeReviews(reviews);
    expect(s.count).toBe(2);
    expect(s.average).toBe(5);
    expect(s.distribution).toEqual({ 5: 2, 4: 0, 3: 0, 2: 0, 1: 0 });
  });
});
