"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client para componentes "client" / hooks del browser.
 *
 * Usa las variables públicas (anon key + URL) que SÍ se exponen al cliente.
 * Nunca usar el service role acá.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Revisá tu .env.local — ver .env.example.",
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
