import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/shared/supabase/server";

export const runtime = "nodejs";

/**
 * Callback de Supabase Auth.
 *
 * `recoverPassword` (src/features/auth/service.supabase.ts) manda a Supabase un
 * `redirectTo` apuntando acá, y Supabase agrega `?code=...`. Esta ruta faltaba,
 * así que el link del email de recuperación caía en un 404 y no había forma de
 * recuperar la contraseña.
 *
 * Canjea el código por una sesión (deja las cookies servidas por
 * `createSupabaseServerClient`) y redirige a `next`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/cuenta";

  // Sólo rutas internas: evita que un `next` externo convierta esto en un
  // redirector abierto.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/cuenta";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
