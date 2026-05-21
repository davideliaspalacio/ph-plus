import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Helper estándar: clsx + tailwind-merge en un solo paso. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
