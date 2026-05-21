import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "./src/shared/supabase/middleware";

/**
 * Next.js 16 "proxy" handler (antes llamado middleware).
 * Corre en cada request a rutas relevantes y refresca la sesión de Supabase
 * para que la cookie no expire.
 */
export async function proxy(request: NextRequest) {
  // Si Supabase no está configurado todavía, no rompemos la app: dejamos pasar.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }
  return updateSupabaseSession(request);
}

export const config = {
  /*
   * Excluimos assets estáticos del runtime del proxy para no pagar el
   * costo de refrescar la sesión en cada imagen o archivo público.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
