"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, placeholder, options, className, id, required, ...rest },
  ref,
) {
  const reactId = useId();
  const selectId = id ?? reactId;
  const descId = `${selectId}-desc`;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          {label}
          {required && " *"}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError || hint ? descId : undefined}
        defaultValue={placeholder ? "" : rest.defaultValue}
        className={cn(
          "h-11 w-full appearance-none rounded-2xl border bg-white px-4 pr-10 text-[14px] text-ink shadow-sm transition-colors focus:outline-none",
          hasError
            ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
            : "border-card-border focus:border-brand focus:ring-2 focus:ring-brand/20",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%236b6b6b%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat",
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hasError ? (
        <p id={descId} className="mt-1.5 text-[12px] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={descId} className="mt-1.5 text-[12px] text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
