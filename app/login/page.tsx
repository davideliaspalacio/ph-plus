"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, Input } from "@/src/shared/ui";
import { login } from "@/src/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/cuenta");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg === "INVALID_CREDENTIALS"
          ? "Email o contraseña incorrectos."
          : "No pudimos iniciar tu sesión. Intentá de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-8">
        <h1 className="text-[28px] font-extrabold text-brand">Iniciar sesión</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Accedé a tus pedidos, direcciones y favoritos.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input
            label="Email"
            type="email"
            required
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <Button type="submit" isLoading={loading} fullWidth size="lg">
            Entrar
          </Button>
        </form>
        <p className="mt-6 text-center text-[14px] text-ink-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-semibold text-brand">
            Crear cuenta
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
