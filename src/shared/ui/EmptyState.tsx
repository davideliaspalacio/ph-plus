import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-card-border bg-white px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-ink-muted">{icon}</div>}
      <h3 className="text-[18px] font-extrabold text-brand">{title}</h3>
      {description && (
        <p className="max-w-md text-[14px] text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
