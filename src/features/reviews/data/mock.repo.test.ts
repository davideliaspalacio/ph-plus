import { beforeEach, describe, expect, it } from "vitest";
import { MockReviewRepo, REVIEWS_NAMESPACE } from "./mock.repo";
import { REVIEW_ERRORS, type NewReviewInput } from "./ports";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";

/**
 * Tests del repo mock: create con defaults, listByProduct con filtros,
 * transiciones approve/reject/respond, error NOT_FOUND, listForModeration.
 */

const ns = makeNamespacedStorage(REVIEWS_NAMESPACE);

function makeInput(partial: Partial<NewReviewInput> = {}): NewReviewInput {
  return {
    productSlug: "camisa-azul",
    authorName: "Juan",
    rating: 5,
    title: "Excelente",
    text: "Producto cumple lo prometido.",
    recommends: true,
    ...partial,
  };
}

beforeEach(() => {
  localStorage.clear();
  ns.clear();
});

describe("MockReviewRepo", () => {
  it("create asigna id, status='pending' por default y createdAt=updatedAt", async () => {
    const repo = new MockReviewRepo();
    const created = await repo.create(makeInput());
    expect(created.id).toBeTruthy();
    expect(created.status).toBe("pending");
    expect(created.createdAt).toBe(created.updatedAt);
    expect(created.productSlug).toBe("camisa-azul");
  });

  it("listByProduct filtra por slug y devuelve orden createdAt desc", async () => {
    const repo = new MockReviewRepo();
    const a = await repo.create(makeInput({ productSlug: "p1", title: "A" }));
    // forzar timestamp posterior
    await new Promise((r) => setTimeout(r, 5));
    const b = await repo.create(makeInput({ productSlug: "p1", title: "B" }));
    await new Promise((r) => setTimeout(r, 5));
    await repo.create(makeInput({ productSlug: "p2", title: "C" }));

    const list = await repo.listByProduct("p1");
    expect(list.map((r) => r.id)).toEqual([b.id, a.id]);
  });

  it("listByProduct filtra por status si se pasa", async () => {
    const repo = new MockReviewRepo();
    const a = await repo.create(makeInput({ productSlug: "p1" }));
    const b = await repo.create(makeInput({ productSlug: "p1" }));
    await repo.approve(a.id);

    const approved = await repo.listByProduct("p1", "approved");
    expect(approved).toHaveLength(1);
    expect(approved[0].id).toBe(a.id);

    const pending = await repo.listByProduct("p1", "pending");
    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe(b.id);
  });

  it("approve setea status='approved', limpia rejectionReason y mueve updatedAt", async () => {
    const repo = new MockReviewRepo();
    const created = await repo.create(makeInput());
    await repo.reject(created.id, "spam");
    await new Promise((r) => setTimeout(r, 5));
    const approved = await repo.approve(created.id);
    expect(approved.status).toBe("approved");
    expect(approved.rejectionReason).toBeUndefined();
    expect(approved.updatedAt).not.toBe(created.updatedAt);
  });

  it("reject setea status='rejected', rejectionReason y mueve updatedAt", async () => {
    const repo = new MockReviewRepo();
    const created = await repo.create(makeInput());
    await new Promise((r) => setTimeout(r, 5));
    const rejected = await repo.reject(created.id, "off-topic");
    expect(rejected.status).toBe("rejected");
    expect(rejected.rejectionReason).toBe("off-topic");
    expect(rejected.updatedAt).not.toBe(created.updatedAt);
  });

  it("respond setea adminResponse, mueve updatedAt y NO cambia status", async () => {
    const repo = new MockReviewRepo();
    const created = await repo.create(makeInput());
    await new Promise((r) => setTimeout(r, 5));
    const responded = await repo.respond(created.id, "Gracias por la review");
    expect(responded.adminResponse).toBe("Gracias por la review");
    expect(responded.status).toBe("pending"); // sin cambio
    expect(responded.updatedAt).not.toBe(created.updatedAt);
  });

  it("approve/reject/respond tiran NOT_FOUND si no existe el id", async () => {
    const repo = new MockReviewRepo();
    await expect(repo.approve("nope")).rejects.toThrow(REVIEW_ERRORS.NOT_FOUND);
    await expect(repo.reject("nope", "x")).rejects.toThrow(
      REVIEW_ERRORS.NOT_FOUND,
    );
    await expect(repo.respond("nope", "x")).rejects.toThrow(
      REVIEW_ERRORS.NOT_FOUND,
    );
  });

  it("listForModeration con default devuelve solo pending y filtra por status", async () => {
    const repo = new MockReviewRepo();
    const a = await repo.create(makeInput({ productSlug: "p1" }));
    const b = await repo.create(makeInput({ productSlug: "p2" }));
    const c = await repo.create(makeInput({ productSlug: "p3" }));
    await repo.approve(a.id);
    await repo.reject(b.id, "spam");

    const pending = await repo.listForModeration();
    expect(pending.map((r) => r.id)).toEqual([c.id]);

    const approved = await repo.listForModeration("approved");
    expect(approved.map((r) => r.id)).toEqual([a.id]);

    const rejected = await repo.listForModeration("rejected");
    expect(rejected.map((r) => r.id)).toEqual([b.id]);
  });
});
