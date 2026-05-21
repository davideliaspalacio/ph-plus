import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-card-border/60 text-ink",
  brand: "bg-brand/10 text-brand",
  success: "bg-whatsapp/15 text-whatsapp-dark",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-accent-cyan/20 text-brand",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
