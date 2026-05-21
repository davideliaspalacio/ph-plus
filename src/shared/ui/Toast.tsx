"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/src/shared/lib/cn";
import { newId } from "@/src/shared/lib/id";

export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  tone: ToastTone;
  message: ReactNode;
  duration: number;
}

type Notify = {
  info: (msg: ReactNode, duration?: number) => string;
  success: (msg: ReactNode, duration?: number) => string;
  warning: (msg: ReactNode, duration?: number) => string;
  error: (msg: ReactNode, duration?: number) => string;
};

interface ToastContextValue {
  toasts: ToastItem[];
  notify: Notify;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// helper para testing: limpiar el storage interno entre tests
let resetFn: (() => void) | null = null;
export function __resetToastsForTests() {
  resetFn?.();
}

export function ToastProvider({
  children,
  defaultDuration = 4000,
  max = 3,
}: {
  children: ReactNode;
  defaultDuration?: number;
  max?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    resetFn = () => setToasts([]);
    return () => {
      resetFn = null;
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: ReactNode, duration?: number) => {
      const id = newId(8);
      const item: ToastItem = {
        id,
        tone,
        message,
        duration: duration ?? defaultDuration,
      };
      setToasts((prev) => [...prev, item].slice(-max));
      if (item.duration > 0) {
        setTimeout(() => dismiss(id), item.duration);
      }
      return id;
    },
    [defaultDuration, dismiss, max],
  );

  const notify = useMemo<Notify>(
    () => ({
      info: (m, d) => push("info", m, d),
      success: (m, d) => push("success", m, d),
      warning: (m, d) => push("warning", m, d),
      error: (m, d) => push("error", m, d),
    }),
    [push],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, notify, dismiss, clear: () => setToasts([]) }),
    [toasts, notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Render-safe fallback: if no provider, no-op. Útil para tests aislados.
    const noop = () => "";
    return {
      toasts: [],
      notify: { info: noop, success: noop, warning: noop, error: noop },
      dismiss: () => {},
      clear: () => {},
    };
  }
  return ctx;
}

const toneStyles: Record<ToastTone, string> = {
  info: "bg-white text-ink border-brand/30",
  success: "bg-whatsapp text-white border-whatsapp-dark",
  warning: "bg-amber-100 text-amber-900 border-amber-300",
  error: "bg-red-600 text-white border-red-700",
};

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4 sm:right-4 sm:left-auto sm:top-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-[14px] shadow-lg",
            toneStyles[t.tone],
          )}
        >
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Cerrar notificación"
            className="opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
