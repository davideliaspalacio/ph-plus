"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/src/shared/ui";
import { useAuth, type Role } from "@/src/features/auth";

const ADMIN_ROLES: readonly Role[] = ["staff", "super_admin", "read_only"];

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      if (!ADMIN_ROLES.includes(user.role)) {
        // No es admin: cerramos la sesión que `login` abrió y mostramos error.
        logout();
        setError(
          "Esta cuenta no tiene permisos de administrador. Logueate como admin.",
        );
        return;
      }
      router.replace("/admin");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "ERROR";
      if (msg === "INVALID_CREDENTIALS") {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("No pudimos iniciar sesión. Probá de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* Brand side */}
      <aside className="relative hidden flex-col justify-between bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-3 text-[20px] font-extrabold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-brand">
            PH
          </span>
          PH PLUS
        </div>
        <div>
          <h2 className="text-[32px] font-extrabold leading-tight">
            Panel de administración
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-white/80">
            Gestioná pedidos, inventario, cupones y clientes desde un solo
            lugar. Acceso restringido a personal autorizado.
          </p>
        </div>
        <p className="text-[12px] text-white/60">
          © PH PLUS — Hidratación consciente.
        </p>
      </aside>

      {/* Form side */}
      <section className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-sm flex-col gap-5"
          noValidate
        >
          <div>
            <h1 className="text-[26px] font-extrabold text-brand">
              Iniciar sesión
            </h1>
            <p className="mt-1 text-[14px] text-ink-muted">
              Ingresá con tu cuenta admin para continuar.
            </p>
          </div>

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@phplus.co"
          />

          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
            >
              {error}
            </p>
          )}

          <Button type="submit" fullWidth isLoading={submitting}>
            Entrar
          </Button>
        </form>
      </section>
    </div>
  );
}
