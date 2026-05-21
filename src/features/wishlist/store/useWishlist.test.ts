import { beforeEach, describe, expect, it } from "vitest";
import { useWishlist, WISHLIST_STORAGE_KEY } from "./useWishlist";

const reset = () => {
  useWishlist.getState().clear();
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
};

describe("useWishlist store", () => {
  beforeEach(() => {
    reset();
  });

  it("arranca con items vacíos y count = 0", () => {
    const s = useWishlist.getState();
    expect(s.items).toEqual([]);
    expect(s.count()).toBe(0);
  });

  it("add agrega un item nuevo con addedAt en formato ISO", () => {
    useWishlist.getState().add("agua-1l");
    const s = useWishlist.getState();
    expect(s.items).toHaveLength(1);
    expect(s.items[0].slug).toBe("agua-1l");
    // ISO: YYYY-MM-DDTHH:mm:ss.sssZ
    expect(s.items[0].addedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    expect(s.contains("agua-1l")).toBe(true);
  });

  it("add es idempotente: no duplica ni cambia addedAt", () => {
    useWishlist.getState().add("agua-1l");
    const firstAddedAt = useWishlist.getState().items[0].addedAt;
    useWishlist.getState().add("agua-1l");
    const s = useWishlist.getState();
    expect(s.items).toHaveLength(1);
    expect(s.items[0].addedAt).toBe(firstAddedAt);
  });

  it("remove quita el item por slug", () => {
    useWishlist.getState().add("agua-1l");
    useWishlist.getState().add("agua-5l");
    useWishlist.getState().remove("agua-1l");
    const s = useWishlist.getState();
    expect(s.items).toHaveLength(1);
    expect(s.items[0].slug).toBe("agua-5l");
    expect(s.contains("agua-1l")).toBe(false);
  });

  it("toggle agrega si no está y quita si está", () => {
    useWishlist.getState().toggle("agua-1l");
    expect(useWishlist.getState().contains("agua-1l")).toBe(true);
    useWishlist.getState().toggle("agua-1l");
    expect(useWishlist.getState().contains("agua-1l")).toBe(false);
  });

  it("clear vacía la wishlist", () => {
    useWishlist.getState().add("agua-1l");
    useWishlist.getState().add("agua-5l");
    useWishlist.getState().clear();
    const s = useWishlist.getState();
    expect(s.items).toEqual([]);
    expect(s.count()).toBe(0);
  });

  it("persiste en localStorage con la llave esperada", () => {
    useWishlist.getState().add("agua-1l");
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    // Zustand persist envuelve en { state, version }
    expect(parsed.state.items).toHaveLength(1);
    expect(parsed.state.items[0].slug).toBe("agua-1l");
  });
});
