"use client";

import { cn } from "@/src/shared/lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Paginación"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="h-9 rounded-full px-4 text-[13px] font-semibold text-ink-muted transition hover:bg-card-border/40 disabled:opacity-40"
      >
        ←
      </button>
      {pages.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={active ? "page" : undefined}
            aria-label={`Página ${p}`}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold transition",
              active
                ? "bg-brand text-white"
                : "text-ink hover:bg-card-border/40",
            )}
          >
            {p}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className="h-9 rounded-full px-4 text-[13px] font-semibold text-ink-muted transition hover:bg-card-border/40 disabled:opacity-40"
      >
        →
      </button>
    </nav>
  );
}
