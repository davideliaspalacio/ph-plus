"use client";

import { useWishlist } from "@/src/features/wishlist";
import { cn } from "@/src/shared/lib/cn";

export interface WishlistButtonProps {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes: Record<NonNullable<WishlistButtonProps["size"]>, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

export function WishlistButton({
  slug,
  className,
  size = "md",
}: WishlistButtonProps) {
  const active = useWishlist((s) => s.contains(slug));
  const toggle = useWishlist((s) => s.toggle);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "grid place-items-center rounded-full border border-card-border bg-white text-[16px] shadow-sm transition-colors",
        active
          ? "border-red-200 bg-red-50 text-red-600"
          : "text-ink-muted hover:text-brand",
        sizes[size],
        className,
      )}
    >
      <span aria-hidden>{active ? "♥" : "♡"}</span>
    </button>
  );
}
