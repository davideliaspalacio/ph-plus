"use client";

import { forwardRef, useState } from "react";
import { Input, type InputProps } from "./Input";

/** Ícono de ojo (abierto/cerrado) para el toggle de mostrar/ocultar contraseña. */
function EyeIcon({ open, className = "h-5 w-5" }: { open: boolean; className?: string }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
        <path
          d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M6.6 6.7C4 8.4 2 12 2 12s4 7 10 7c1.7 0 3.2-.4 4.5-1.1M9.9 4.2C10.6 4.1 11.3 4 12 4c7 0 11 8 11 8a17.5 17.5 0 0 1-3.1 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * `Input` con `type="password"` y un botón de "ojito" para mostrar/ocultar
 * lo escrito — antes no existía en ningún lado del sitio (ni registro ni
 * login), así que el usuario no podía verificar la contraseña que tipeó.
 */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type" | "rightAddon">>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        rightAddon={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
            className="grid h-6 w-6 place-items-center text-ink-muted transition-colors hover:text-ink"
          >
            <EyeIcon open={visible} />
          </button>
        }
      />
    );
  },
);
