"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib/cn";

const NAV = [
  { href: "/cuenta", label: "Resumen", icon: "📊" },
  { href: "/cuenta/perfil", label: "Mi perfil", icon: "👤" },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: "📍" },
  { href: "/cuenta/pedidos", label: "Mis pedidos", icon: "📦" },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: "♥" },
];

export function AccountShell({
  title,
  description,
  children,
  active,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  active: string;
}) {
  return (
    <section className="mx-auto max-w-page px-5 py-10 sm:px-8 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="text-[24px] font-extrabold text-brand">Mi cuenta</h1>
          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map((item) => {
              const isActive = item.href === active;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-ink-muted hover:bg-card-border/40 hover:text-ink",
                  )}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>
          <header className="mb-6">
            <h2 className="text-[22px] font-extrabold text-brand">{title}</h2>
            {description && (
              <p className="mt-1 text-[14px] text-ink-muted">{description}</p>
            )}
          </header>
          {children}
        </main>
      </div>
    </section>
  );
}
