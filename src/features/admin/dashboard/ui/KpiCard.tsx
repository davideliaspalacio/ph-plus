import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export type KpiCardTone = "brand" | "whatsapp" | "neutral";

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: KpiCardTone;
  className?: string;
}

const tones: Record<KpiCardTone, { wrap: string; label: string; value: string }> = {
  brand: {
    wrap: "border-brand/20 bg-white",
    label: "text-ink-muted",
    value: "text-brand",
  },
  whatsapp: {
    wrap: "border-whatsapp/30 bg-white",
    label: "text-ink-muted",
    value: "text-whatsapp-dark",
  },
  neutral: {
    wrap: "border-card-border bg-white",
    label: "text-ink-muted",
    value: "text-ink",
  },
};

export function KpiCard({
  label,
  value,
  hint,
  tone = "brand",
  className,
}: KpiCardProps) {
  const t = tones[tone];
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl border p-5 shadow-sm",
        t.wrap,
        className,
      )}
    >
      <p className={cn("text-[12px] font-semibold uppercase tracking-wide", t.label)}>
        {label}
      </p>
      <p className={cn("text-[26px] font-extrabold leading-tight", t.value)}>
        {value}
      </p>
      {hint && (
        <p className="text-[12px] text-ink-muted">{hint}</p>
      )}
    </div>
  );
}
