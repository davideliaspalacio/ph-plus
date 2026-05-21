"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/src/shared/ui";
import { userRepo, useSession, type PublicUser } from "@/src/features/auth";

export function ProfileForm() {
  const session = useSession((s) => s.session);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.userId) return;
      const u = await userRepo.findById(session.userId);
      if (cancelled) return;
      if (u) {
        const { passwordHash: _ph, ...pub } = u;
        setUser(pub as PublicUser);
        setName(u.name);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.userId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) return;
    try {
      await userRepo.update(user.id, { name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (!user) {
    return <p className="text-[14px] text-ink-muted">Cargando perfil…</p>;
  }

  return (
    <form onSubmit={submit} className="grid max-w-md gap-4">
      <Input
        label="Email"
        type="email"
        value={user.email}
        disabled
        hint="No podés cambiar tu email."
      />
      <Input
        label="Nombre"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button type="submit">Guardar cambios</Button>
        {saved && (
          <span className="text-[13px] text-whatsapp-dark">Guardado ✓</span>
        )}
      </div>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </form>
  );
}
