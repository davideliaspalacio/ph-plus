/**
 * Resuelve el usuario autenticado real de una request de servidor, leyendo
 * la cookie de sesión de Supabase Auth — NUNCA confiar en un `userId` que
 * venga en el body del request, cualquiera podría mandar el de otra persona.
 *
 * Devuelve `null` si no hay sesión válida (visitante anónimo/guest), nunca
 * tira: un fallo leyendo la sesión no debe romper el checkout, sólo hace que
 * el pedido quede sin vincular a una cuenta (igual que hoy).
 */
export async function resolveAuthenticatedUserId(): Promise<string | null> {
  if (
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  try {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}
