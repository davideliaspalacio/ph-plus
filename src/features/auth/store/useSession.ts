"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role } from "../domain/user";

export const SESSION_STORAGE_KEY = "phplus.session";

/** TTL por defecto de la sesión: 7 días. */
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type SessionData = {
  userId: string;
  role: Role;
  /** Epoch ms en el que la sesión expira. */
  expiresAt: number;
};

export type SessionState = {
  session: SessionData | null;
  /**
   * `false` hasta que el middleware `persist` termina de leer `localStorage`
   * (siempre arranca en `false`, incluso client-side, porque la primera
   * hidratación es asíncrona). `RequireAuth` lo usa para no mostrar
   * "Iniciá sesión" un instante antes de saber si en realidad SÍ hay sesión
   * — eso pasaba en toda carga dura de página (F5, link externo) porque la
   * sesión vive sólo en localStorage, no en una cookie que el SSR pueda leer.
   */
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
  /** True si hay sesión y todavía no expiró. */
  isAuthenticated: () => boolean;
};

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      session: null,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setSession: (data) => set({ session: data }),

      clearSession: () => set({ session: null }),

      isAuthenticated: () => {
        const s = get().session;
        if (!s) return false;
        return s.expiresAt > Date.now();
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
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
      partialize: (state) => ({ session: state.session }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
