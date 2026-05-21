/**
 * Sincronización entre la sesión de Supabase Auth y el store local
 * (`useSession`). Esto vive aparte del `service.supabase.ts` para que
 * pueda usarse desde un provider que decida cuándo montarlo (sólo cuando
 * `NEXT_PUBLIC_DATA_BACKEND === "supabase"`).
 *
 * Nada de esto se ejecuta automáticamente — el provider correspondiente
 * decide montar `useSupabaseSessionSync()` y/o invocar
 * `syncSessionFromSupabase()`.
 */

"use client";

import { useEffect } from "react";
import { useSession, SESSION_TTL_MS } from "./store/useSession";
import { RoleSchema, type Role } from "./domain/user";
import type { Database } from "@/src/shared/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type DbClient = SupabaseClient<Database>;

async function getBrowserClient(): Promise<DbClient | null> {
  if (typeof window === "undefined") return null;
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

async function loadRoleFor(
  client: DbClient,
  userId: string,
): Promise<Role> {
  const { data } = await client
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  const row = data as unknown as { role: string } | null;
  const parsed = RoleSchema.safeParse(row?.role);
  return parsed.success ? parsed.data : "customer";
}

/**
 * Lee el estado actual de Supabase Auth y lo refleja en `useSession`.
 * Útil para hidratar la sesión al montar la app (después de un refresh).
 */
export async function syncSessionFromSupabase(): Promise<void> {
  const client = await getBrowserClient();
  if (!client) return;

  const { data, error } = await client.auth.getSession();
  if (error) return;

  const supaSession = data.session;
  if (!supaSession?.user) {
    useSession.getState().clearSession();
    return;
  }

  const role = await loadRoleFor(client, supaSession.user.id);
  const expiresAt =
    typeof supaSession.expires_at === "number"
      ? supaSession.expires_at * 1000
      : Date.now() + SESSION_TTL_MS;

  useSession.getState().setSession({
    userId: supaSession.user.id,
    role,
    expiresAt,
  });
}

/**
 * Hook que se subscribe a `onAuthStateChange` y mantiene `useSession`
 * sincronizado con Supabase. Sólo debería montarse cuando
 * `NEXT_PUBLIC_DATA_BACKEND === "supabase"`.
 */
export function useSupabaseSessionSync(): void {
  useEffect(() => {
    let unsubscribed = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const client = await getBrowserClient();
      if (!client || unsubscribed) return;

      // Hidratación inicial.
      await syncSessionFromSupabase();

      const { data } = client.auth.onAuthStateChange(async (_event, session) => {
        if (!session?.user) {
          useSession.getState().clearSession();
          return;
        }
        const role = await loadRoleFor(client, session.user.id);
        const expiresAt =
          typeof session.expires_at === "number"
            ? session.expires_at * 1000
            : Date.now() + SESSION_TTL_MS;

        useSession.getState().setSession({
          userId: session.user.id,
          role,
          expiresAt,
        });
      });

      unsubscribe = () => data.subscription.unsubscribe();
      if (unsubscribed) unsubscribe();
    })();

    return () => {
      unsubscribed = true;
      unsubscribe?.();
    };
  }, []);
}
