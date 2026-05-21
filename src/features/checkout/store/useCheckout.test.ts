import { beforeEach, describe, expect, it } from "vitest";
import { CHECKOUT_STORAGE_KEY, useCheckout } from "./useCheckout";

const reset = () => {
  useCheckout.getState().reset();
  localStorage.removeItem(CHECKOUT_STORAGE_KEY);
};

describe("useCheckout store", () => {
  beforeEach(() => {
    reset();
  });

  it("arranca con drafts vacíos y sin cupón", () => {
    const s = useCheckout.getState();
    expect(s.contact).toEqual({});
    expect(s.shipping).toEqual({});
    expect(s.couponCode).toBeNull();
  });

  it("setContact hace merge parcial", () => {
    useCheckout.getState().setContact({ email: "a@b.com" });
    useCheckout.getState().setContact({ name: "Ana" });
    expect(useCheckout.getState().contact).toEqual({
      email: "a@b.com",
      name: "Ana",
    });
  });

  it("setShipping hace merge parcial", () => {
    useCheckout.getState().setShipping({ city: "Bogotá" });
    useCheckout.getState().setShipping({ address: "Calle 1" });
    expect(useCheckout.getState().shipping).toEqual({
      city: "Bogotá",
      address: "Calle 1",
    });
  });

  it("setPayment guarda el método", () => {
    useCheckout.getState().setPayment({ method: "pse" });
    expect(useCheckout.getState().payment.method).toBe("pse");
  });

  it("setCoupon guarda y limpia el código", () => {
    useCheckout.getState().setCoupon("DESC10");
    expect(useCheckout.getState().couponCode).toBe("DESC10");
    useCheckout.getState().setCoupon(null);
    expect(useCheckout.getState().couponCode).toBeNull();
  });

  it("clear vacía todos los campos", () => {
    useCheckout.getState().setContact({ name: "Ana" });
    useCheckout.getState().setShipping({ city: "Bogotá" });
    useCheckout.getState().setCoupon("X");
    useCheckout.getState().clear();
    const s = useCheckout.getState();
    expect(s.contact).toEqual({});
    expect(s.shipping).toEqual({});
    expect(s.couponCode).toBeNull();
  });

  it("persiste en localStorage con la llave esperada", () => {
    useCheckout.getState().setContact({ email: "a@b.com" });
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.contact.email).toBe("a@b.com");
  });
});
