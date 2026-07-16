import "server-only";

import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

/**
 * Respaldo propio de las suscripciones al newsletter.
 *
 * Antes el alta sólo viajaba a HubSpot: sin token (o ante un fallo del CRM) el
 * suscriptor se perdía. Ahora guardamos siempre en `newsletter_subscribers` y
 * marcamos `hubspot_synced` para poder reintentar los que no llegaron.
 */

function isSupabaseEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export type NewsletterRecord = {
  email: string;
  name?: string;
  hubspotSynced: boolean;
  hubspotContactId?: string | null;
};

/**
 * Crea o actualiza el suscriptor por email. Fail-safe: si Supabase no está
 * configurado devuelve false; ante un error loguea y devuelve false. Nunca tira.
 */
export async function saveNewsletterSubscriber(
  input: NewsletterRecord,
): Promise<boolean> {
  if (!isSupabaseEnabled()) return false;

  try {
    const supabase = await createSupabaseServiceClient();
    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: input.email,
        name: input.name ?? null,
        source: "footer",
        hubspot_synced: input.hubspotSynced,
        hubspot_contact_id: input.hubspotContactId ?? null,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "email" },
    );
    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    console.error(
      "[newsletter] no se pudo guardar el suscriptor:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
