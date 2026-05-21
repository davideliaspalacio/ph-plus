"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftAddon, rightAddon, className, id, required, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const descId = `${inputId}-desc`;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          {label}
          {required && " *"}
        </label>
      )}
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-2xl border bg-white px-4 text-[14px] text-ink shadow-sm transition-colors",
          hasError
            ? "border-red-500 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-200"
            : "border-card-border focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
        )}
      >
        {leftAddon && <span className="text-ink-muted">{leftAddon}</span>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={(hasError || hint) ? descId : undefined}
          className={cn(
            "w-full bg-transparent outline-none placeholder:text-ink-muted/60",
            className,
          )}
          {...rest}
        />
        {rightAddon && <span className="text-ink-muted">{rightAddon}</span>}
      </div>
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
