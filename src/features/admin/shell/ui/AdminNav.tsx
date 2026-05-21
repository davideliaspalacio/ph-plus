"use client";

import Link from "next/link";
import { cn } from "@/src/shared/lib/cn";

export type AdminNavItem = {
  label: string;
  href: string;
};

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Cupones", href: "/admin/cupones" },
  { label: "Envíos", href: "/admin/envios" },
  { label: "Reseñas", href: "/admin/resenas" },
  { label: "Contenido", href: "/admin/contenido" },
  { label: "Ajustes", href: "/admin/ajustes" },
];

export interface AdminNavProps {
  /** Pathname actual para resaltar el link activo. */
  currentPath: string;
  /** Callback opcional cuando se hace click en un link (cerrar drawer mobile). */
  onNavigate?: () => void;
  className?: string;
}

function isActive(href: string, currentPath: string): boolean {
  if (href === "/admin") return currentPath === "/admin";
  return currentPath === href || currentPath.startsWith(href + "/");
}

export function AdminNav({ currentPath, onNavigate, className }: AdminNavProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Navegación admin">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = isActive(item.href, currentPath);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-xl px-3 py-2 text-[14px] font-semibold transition-colors",
              active
                ? "bg-brand text-white"
                : "text-ink hover:bg-brand/5 hover:text-brand",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
