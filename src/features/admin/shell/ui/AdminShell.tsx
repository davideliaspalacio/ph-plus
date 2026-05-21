"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Drawer } from "@/src/shared/ui";
import { useAuth } from "@/src/features/auth";
import { AdminNav } from "./AdminNav";

export interface AdminShellProps {
  children: ReactNode;
  /**
   * Pathname actual. Si no se pasa, se lee con `usePathname()`. Útil para
   * tests sin tener que mockear next/navigation por test.
   */
  currentPath?: string;
  /** Nombre del usuario logueado para mostrar en el sidebar. */
  userName?: string;
  /** Etiqueta de rol legible. */
  userRoleLabel?: string;
  /**
   * Handler custom de logout. Si no se pasa, llama `useAuth().logout()`.
   * Tras logout, se mantiene en la misma URL — el `RequireAdmin` se
   * encarga de mostrar "No autorizado" en el siguiente render.
   */
  onLogout?: () => void;
}

export function AdminShell({
  children,
  currentPath,
  userName,
  userRoleLabel,
  onLogout,
}: AdminShellProps) {
  const pathname = usePathname();
  const path = currentPath ?? pathname ?? "/admin";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logout();
  };

  return (
    <div className="flex min-h-dvh bg-[#f7f8fb] text-ink">
      {/* Sidebar fijo desktop (lg+) */}
      <aside className="hidden w-[240px] flex-shrink-0 flex-col border-r border-card-border bg-white lg:flex">
        <SidebarContent
          currentPath={path}
          userName={userName}
          userRoleLabel={userRoleLabel}
          onLogout={handleLogout}
        />
      </aside>

      {/* Drawer mobile (<lg) */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Menú admin"
        side="left"
        width="max-w-[280px]"
      >
        <SidebarContent
          currentPath={path}
          userName={userName}
          userRoleLabel={userRoleLabel}
          onLogout={() => {
            setDrawerOpen(false);
            handleLogout();
          }}
          onNavigate={() => setDrawerOpen(false)}
          isInDrawer
        />
      </Drawer>

      {/* Contenido principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-card-border bg-white px-4 lg:px-8">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-muted transition hover:bg-card-border/40 hover:text-ink lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="flex-1">
            <input
              type="search"
              placeholder="Buscar pedidos, productos, clientes…"
              aria-label="Buscar (global)"
              className="hidden h-10 w-full max-w-md rounded-full border border-card-border bg-[#f7f8fb] px-4 text-[14px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 md:block"
            />
          </div>

          {userName && (
            <div className="hidden text-right text-[12px] md:block">
              <div className="font-semibold text-ink">{userName}</div>
              {userRoleLabel && (
                <div className="text-ink-muted">{userRoleLabel}</div>
              )}
            </div>
          )}
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  currentPath,
  userName,
  userRoleLabel,
  onLogout,
  onNavigate,
  isInDrawer,
}: {
  currentPath: string;
  userName?: string;
  userRoleLabel?: string;
  onLogout: () => void;
  onNavigate?: () => void;
  isInDrawer?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {!isInDrawer && (
        <div className="border-b border-card-border px-5 py-5">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-[18px] font-extrabold text-brand"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
              PH
            </span>
            PH PLUS
          </Link>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-muted">
            Panel admin
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AdminNav currentPath={currentPath} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-card-border px-4 py-4">
        {userName && (
          <div className="mb-3 text-[12px]">
            <div className="font-semibold text-ink">{userName}</div>
            {userRoleLabel && (
              <div className="text-ink-muted">{userRoleLabel}</div>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex w-full items-center justify-center rounded-full border border-card-border bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
