import { cn } from "@/src/shared/lib/cn";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "rect" | "circle" | "text";
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = "rect",
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width != null) style.width = typeof width === "number" ? `${width}px` : width;
  if (height != null) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "skeleton",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-xl",
        variant === "text" && "h-3 rounded",
        className,
      )}
    />
  );
}
