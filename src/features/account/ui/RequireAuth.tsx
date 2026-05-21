"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSession } from "@/src/features/auth";
import { Button } from "@/src/shared/ui";

export interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const session = useSession((s) => s.session);
  const isAuth = session != null && session.expiresAt > Date.now();

  if (!isAuth) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-card-border bg-white px-6 py-12 text-center">
        <h2 className="text-[20px] font-extrabold text-brand">
          Iniciá sesión para continuar
        </h2>
        <p className="text-[14px] text-ink-muted">
          Accedé a tus pedidos, direcciones y favoritos.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button>Iniciar sesión</Button>
          </Link>
          <Link href="/registro">
            <Button variant="outline">Crear cuenta</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
