"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Ingresá un email válido.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setMessage("¡Listo! Te sumaste a las novedades de PH PLUS.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("No pudimos registrarte. Intentá de nuevo en un momento.");
    }
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-10 sm:py-12">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-[#eef0ff] px-6 py-8 text-center sm:px-10">
          <div>
            <h2 className="text-[20px] font-extrabold text-brand sm:text-[26px]">
              Sumate a las novedades de PH PLUS
            </h2>
            <p className="mt-2 text-[13px] text-ink-muted sm:text-[15px]">
              Promos, nuevos productos y tips de hidratación. Sin spam.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
              className="flex-1 rounded-full border border-card-border bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-60"
            >
              {status === "loading" ? "Enviando..." : "Suscribirme"}
            </button>
          </form>

          {message && (
            <p
              aria-live="polite"
              className={
                "text-[13px] font-semibold " +
                (status === "success" ? "text-whatsapp-dark" : "text-red-600")
              }
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
