"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, Input } from "@/src/shared/ui";
import { signup } from "@/src/features/auth";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!acceptsTerms) {
        throw new Error("ACCEPT_TERMS");
      }
      await signup({ name, email, password, acceptsTerms: true });
      router.push("/cuenta");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg === "EMAIL_TAKEN"
          ? "Ese email ya está registrado. Iniciá sesión."
          : msg === "ACCEPT_TERMS"
            ? "Tenés que aceptar los términos."
            : "No pudimos crear tu cuenta. Revisá los datos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-8">
        <h1 className="text-[28px] font-extrabold text-brand">Crear cuenta</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Es gratis. Te ayudamos a llevar el control de tus pedidos.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input
            label="Nombre completo"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            hint="Mínimo 8 caracteres con al menos un número."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="flex items-start gap-2 text-[13px] text-ink">
            <input
              type="checkbox"
              checked={acceptsTerms}
              onChange={(e) => setAcceptsTerms(e.target.checked)}
              className="mt-1"
              required
            />
            Acepto los términos y la política de privacidad.
          </label>
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <Button type="submit" isLoading={loading} fullWidth size="lg">
            Crear cuenta
          </Button>
        </form>
        <p className="mt-6 text-center text-[14px] text-ink-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Iniciar sesión
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
