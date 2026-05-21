"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ items, defaultActiveId, onChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultActiveId ?? items[0]?.id);
  const activeItem = items.find((i) => i.id === active);

  const handle = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        className="flex flex-wrap gap-2 border-b border-card-border"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => handle(item.id)}
              className={cn(
                "relative -mb-px border-b-2 px-4 py-2.5 text-[14px] font-semibold transition-colors",
                selected
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-4 text-[14px] text-ink">
        {activeItem?.content}
      </div>
    </div>
  );
}
