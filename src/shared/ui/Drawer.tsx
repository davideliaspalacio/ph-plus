"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export type DrawerSide = "left" | "right" | "bottom";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: DrawerSide;
  width?: string;
  footer?: ReactNode;
  className?: string;
}

const sideStyles: Record<DrawerSide, string> = {
  right: "right-0 top-0 h-full",
  left: "left-0 top-0 h-full",
  bottom: "bottom-0 left-0 right-0 max-h-[90vh] rounded-t-3xl",
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  width = "max-w-md",
  footer,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fondo, hacer click para cerrar"
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute flex w-full flex-col bg-white shadow-2xl",
          sideStyles[side],
          side !== "bottom" && width,
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
          <h2 className="text-[16px] font-extrabold text-brand">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-card-border/40 hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-card-border px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
