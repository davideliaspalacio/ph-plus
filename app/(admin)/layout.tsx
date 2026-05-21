"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell, RequireAdmin } from "@/src/features/admin/shell";
import { useSession, userRepo, type PublicUser } from "@/src/features/auth";

/**
 * Layout del grupo de rutas (admin).
 *
 * - `RequireAdmin` gatea por rol: solo `staff`, `super_admin` y `read_only`
 *   ven el contenido. Para todo lo demás muestra "No autorizado" con CTA
 *   hacia `/admin/login`.
 * - La pantalla `/admin/login` queda EXCLUIDA del shell — se renderiza
 *   pelada (sin sidebar) para no obligar a estar logueado para verla.
 */
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/admin";
  const isLoginRoute = pathname === "/admin/login";
  const session = useSession((s) => s.session);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setUser(null);
      return;
    }
    userRepo
      .findById(session.userId)
      .then((u) => {
        if (cancelled) return;
        if (!u) {
          setUser(null);
          return;
        }
        const { passwordHash: _ph, ...publicUser } = u;
        void _ph;
        setUser(publicUser);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  const roleLabel = session?.role
    ? ROLE_LABEL[session.role] ?? session.role
    : undefined;

  return (
    <RequireAdmin>
      <AdminShell
        currentPath={pathname}
        userName={user?.name}
        userRoleLabel={roleLabel}
      >
        {children}
      </AdminShell>
    </RequireAdmin>
  );
}

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super admin",
  staff: "Staff",
  read_only: "Solo lectura",
};
