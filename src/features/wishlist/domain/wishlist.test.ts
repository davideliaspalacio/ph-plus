import { describe, expect, it } from "vitest";
import {
  add,
  contains,
  count,
  remove,
  toggle,
  type WishlistItem,
} from "./wishlist";

const fixedNow = () => "2026-05-20T10:00:00.000Z";

describe("wishlist domain", () => {
  describe("contains", () => {
    it("retorna false en lista vacía", () => {
      expect(contains([], "agua-1l")).toBe(false);
    });

    it("retorna true cuando el slug está presente", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
      ];
      expect(contains(list, "agua-1l")).toBe(true);
    });

    it("retorna false cuando el slug no está presente", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
      ];
      expect(contains(list, "agua-5l")).toBe(false);
    });
  });

  describe("add", () => {
    it("agrega un item nuevo con el addedAt provisto por now()", () => {
      const next = add([], "agua-1l", fixedNow);
      expect(next).toEqual([{ slug: "agua-1l", addedAt: fixedNow() }]);
    });

    it("es idempotente: si el slug ya existe no duplica ni actualiza addedAt", () => {
      const original: WishlistItem[] = [
        { slug: "agua-1l", addedAt: "2026-01-01T00:00:00.000Z" },
      ];
      const next = add(original, "agua-1l", fixedNow);
      expect(next).toHaveLength(1);
      expect(next[0].addedAt).toBe("2026-01-01T00:00:00.000Z");
    });

    it("no muta la lista original (inmutable)", () => {
      const original: WishlistItem[] = [];
      const next = add(original, "agua-1l", fixedNow);
      expect(original).toEqual([]);
      expect(next).not.toBe(original);
    });
  });

  describe("remove", () => {
    it("elimina el item por slug", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
        { slug: "agua-5l", addedAt: fixedNow() },
      ];
      const next = remove(list, "agua-1l");
      expect(next).toEqual([{ slug: "agua-5l", addedAt: fixedNow() }]);
    });

    it("remover un slug inexistente no rompe y devuelve nueva referencia", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
      ];
      const next = remove(list, "no-existe");
      expect(next).toEqual(list);
    });

    it("no muta la lista original", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
      ];
      remove(list, "agua-1l");
      expect(list).toHaveLength(1);
    });
  });

  describe("toggle", () => {
    it("agrega el item si no estaba", () => {
      const next = toggle([], "agua-1l", fixedNow);
      expect(next).toEqual([{ slug: "agua-1l", addedAt: fixedNow() }]);
    });

    it("quita el item si ya estaba", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
      ];
      const next = toggle(list, "agua-1l", fixedNow);
      expect(next).toEqual([]);
    });

    it("no muta la lista original", () => {
      const list: WishlistItem[] = [];
      toggle(list, "agua-1l", fixedNow);
      expect(list).toEqual([]);
    });
  });

  describe("count", () => {
    it("devuelve 0 para lista vacía", () => {
      expect(count([])).toBe(0);
    });

    it("devuelve la cantidad de items", () => {
      const list: WishlistItem[] = [
        { slug: "agua-1l", addedAt: fixedNow() },
        { slug: "agua-5l", addedAt: fixedNow() },
        { slug: "agua-10l", addedAt: fixedNow() },
      ];
      expect(count(list)).toBe(3);
    });
  });
});
