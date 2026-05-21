"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "danger"
  | "whatsapp";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark active:bg-brand-deep shadow-[0_6px_18px_rgba(27,34,166,0.25)]",
  outline:
    "bg-white text-brand border border-brand hover:bg-brand hover:text-white",
  ghost: "bg-transparent text-brand hover:bg-brand/5",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-[0_6px_18px_rgba(220,38,38,0.25)]",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-[0_6px_18px_rgba(37,211,102,0.25)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    fullWidth,
    leftIcon,
    rightIcon,
    className,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={isLoading || undefined}
      disabled={isDisabled}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});
