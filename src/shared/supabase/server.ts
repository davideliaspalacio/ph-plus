import type { Database } from "./types";

/**
 * Supabase client para Server Components, Route Handlers y Server Actions.
 *
 * IMPORTANTE: este archivo intencionalmente NO usa `import "server-only"` ni
 * `import { cookies } from "next/headers"` en top-level. Esto permite que el
 * árbol de imports estático sea seguro: aunque un Client Component importe
 * indirectamente este módulo (vía la API pública de un feature), nunca
 * se ejecuta el código de Node-only porque las importaciones de
 * `@supabase/ssr` y `next/headers` se hacen DENTRO del cuerpo de la función,
 * detrás de un check de `typeof window`.
 *
 * Protección runtime: si alguien lo llama desde el browser, el chequeo de
 * window tira un error legible en vez de fallar oscuramente.
 */
export async function createSupabaseServerClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createSupabaseServerClient() debe usarse sólo en server runtime. " +
        "Para el browser usá createSupabaseBrowserClient() desde ./client",
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const [{ createServerClient }, { cookies }] = await Promise.all([
    import("@supabase/ssr"),
    import("next/headers"),
  ]);

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `set` puede tirar cuando lo llamamos desde un Server Component
          // de sólo lectura. El proxy (middleware) refresca la cookie.
        }
      },
    },
  });
}

/**
 * Cliente con service role — sólo para operaciones server-side que necesiten
 * bypassear RLS. NUNCA expongas esto al browser ni a un Server Component que
 * devuelva data al cliente sin filtrar.
 */
export async function createSupabaseServiceClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createSupabaseServiceClient() NUNCA debe ejecutarse en el browser.",
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. " +
        "El service role NO debe estar en .env del cliente.",
    );
  }

  const { createClient } = await import("@supabase/supabase-js");

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
