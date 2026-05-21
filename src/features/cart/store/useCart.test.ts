import { beforeEach, describe, expect, it } from "vitest";
import { useCart, CART_STORAGE_KEY } from "./useCart";

const reset = () => {
  useCart.getState().clear();
  // Forzamos rehydrate desde 0
  localStorage.removeItem(CART_STORAGE_KEY);
};

describe("useCart store", () => {
  beforeEach(() => {
    reset();
  });

  it("arranca con items vacíos y totalItems = 0", () => {
    const s = useCart.getState();
    expect(s.items).toEqual([]);
    expect(s.totalItems()).toBe(0);
  });

  it("agrega un item nuevo con cantidad por defecto 1", () => {
    useCart.getState().addItem("agua-1l");
    const s = useCart.getState();
    expect(s.items).toEqual([{ slug: "agua-1l", quantity: 1 }]);
    expect(s.totalItems()).toBe(1);
  });

  it("agrega cantidad a un item existente (no duplica líneas)", () => {
    useCart.getState().addItem("agua-1l", 2);
    useCart.getState().addItem("agua-1l", 3);
    const s = useCart.getState();
    expect(s.items).toHaveLength(1);
    expect(s.items[0]).toEqual({ slug: "agua-1l", quantity: 5 });
    expect(s.totalItems()).toBe(5);
  });

  it("setQuantity actualiza la cantidad de un item existente", () => {
    useCart.getState().addItem("agua-1l", 1);
    useCart.getState().setQuantity("agua-1l", 7);
    expect(useCart.getState().items[0].quantity).toBe(7);
  });

  it("setQuantity con qty <= 0 elimina el item", () => {
    useCart.getState().addItem("agua-1l", 4);
    useCart.getState().setQuantity("agua-1l", 0);
    expect(useCart.getState().items).toEqual([]);
  });

  it("removeItem quita la línea", () => {
    useCart.getState().addItem("agua-1l", 1);
    useCart.getState().addItem("agua-5l", 2);
    useCart.getState().removeItem("agua-1l");
    expect(useCart.getState().items).toEqual([
      { slug: "agua-5l", quantity: 2 },
    ]);
  });

  it("clear vacía el carrito", () => {
    useCart.getState().addItem("agua-1l", 1);
    useCart.getState().addItem("agua-5l", 2);
    useCart.getState().clear();
    expect(useCart.getState().items).toEqual([]);
    expect(useCart.getState().totalItems()).toBe(0);
  });

  it("persiste en localStorage con la llave esperada", () => {
    useCart.getState().addItem("agua-1l", 3);
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    // Zustand persist envuelve en { state, version }
    expect(parsed.state.items).toEqual([{ slug: "agua-1l", quantity: 3 }]);
  });
});
