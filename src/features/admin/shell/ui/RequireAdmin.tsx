"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSession, type Role } from "@/src/features/auth";

const ADMIN_ROLES: readonly Role[] = ["staff", "super_admin", "read_only"];

export interface RequireAdminProps {
  children: ReactNode;
  /**
   * Permite forzar el rol en tests sin tener que tocar el store global.
   * En producción se omite y se lee `useSession`.
   */
  sessionRole?: Role | null;
}

export function RequireAdmin({ children, sessionRole }: RequireAdminProps) {
  const storeSession = useSession((s) => s.session);
  const role: Role | null =
    sessionRole !== undefined ? sessionRole : storeSession?.role ?? null;

  const isAdmin = role !== null && ADMIN_ROLES.includes(role);

  if (!isAdmin) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-card-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-[22px] font-extrabold text-brand">
            No autorizado
          </h1>
          <p className="text-[14px] text-ink-muted">
            Esta sección es solo para usuarios con permisos de administración.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Ir a login admin
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
