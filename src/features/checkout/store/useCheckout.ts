"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ContactInput,
  PaymentInput,
  ShippingAddressInput,
} from "../domain/schema";

export const CHECKOUT_STORAGE_KEY = "phplus.checkout.draft.v1";

/**
 * Borrador del formulario de checkout.
 *
 * Persiste en localStorage (key `phplus.checkout.draft.v1`) para no perder
 * datos si el usuario refresca o navega. Se limpia explícitamente vía
 * `clear()` al confirmar el pedido.
 *
 * Todos los campos son parciales — el store no valida; eso lo hace el form
 * con los schemas de `domain/schema.ts`.
 */

export type DraftContact = Partial<ContactInput>;
export type DraftShipping = Partial<ShippingAddressInput>;
export type DraftPayment = Partial<PaymentInput>;

export type CheckoutDraftState = {
  contact: DraftContact;
  shipping: DraftShipping;
  payment: DraftPayment;
  couponCode: string | null;

  setContact: (patch: DraftContact) => void;
  setShipping: (patch: DraftShipping) => void;
  setPayment: (patch: DraftPayment) => void;
  setCoupon: (code: string | null) => void;
  clear: () => void;
  reset: () => void;
};

const EMPTY_STATE: Pick<
  CheckoutDraftState,
  "contact" | "shipping" | "payment" | "couponCode"
> = {
  contact: {},
  shipping: {},
  payment: { method: undefined },
  couponCode: null,
};

export const useCheckout = create<CheckoutDraftState>()(
  persist(
    (set) => ({
      ...EMPTY_STATE,

      setContact: (patch) =>
        set((s) => ({ contact: { ...s.contact, ...patch } })),

      setShipping: (patch) =>
        set((s) => ({ shipping: { ...s.shipping, ...patch } })),

      setPayment: (patch) =>
        set((s) => ({ payment: { ...s.payment, ...patch } })),

      setCoupon: (code) => set({ couponCode: code }),

      clear: () => set({ ...EMPTY_STATE }),

      reset: () => set({ ...EMPTY_STATE }),
    }),
    {
      name: CHECKOUT_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (s) => ({
        contact: s.contact,
        shipping: s.shipping,
        payment: s.payment,
        couponCode: s.couponCode,
      }),
      version: 1,
    },
  ),
);
