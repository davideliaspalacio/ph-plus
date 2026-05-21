"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Fondo, hacer click para cerrar"
        data-testid="modal-backdrop"
        onClick={() => closeOnBackdrop && onClose()}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl",
          sizes[size],
          className,
        )}
      >
        <div className="flex items-start justify-between border-b border-card-border px-6 pb-4 pt-5">
          <h2 className="text-[18px] font-extrabold text-brand">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-card-border/40 hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 text-[14px] text-ink">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-card-border bg-[#fafbff] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
