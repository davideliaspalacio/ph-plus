/**
 * API pública del módulo Supabase.
 *
 *   import { createSupabaseBrowserClient } from "@/src/shared/supabase";
 *   import { createSupabaseServerClient } from "@/src/shared/supabase/server";
 *
 * El client / server / service están separados para que el bundler no incluya
 * código de servidor en el bundle del browser.
 */

export type { Database, Role, ProfileRow } from "./types";
