import { NextResponse } from "next/server";
import { z } from "zod";

import { subscribeNewsletterContact } from "@/app/lib/hubspot-server";
import { saveNewsletterSubscriber } from "@/app/lib/newsletter-server";

export const runtime = "nodejs";

const newsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().max(80).optional(),
});

/**
 * Alta de suscriptor al newsletter.
 *
 * Guarda SIEMPRE en `newsletter_subscribers` (cuando Supabase está activo) y
 * además intenta el alta en HubSpot. Si HubSpot no está configurado o falla, el
 * suscriptor no se pierde: queda en la tabla con `hubspot_synced = false` para
 * reintentar. Devuelve 200 aunque el CRM falle, para no romper el formulario.
 */
export async function POST(request: Request) {
  const parsed = newsletterSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const result = await subscribeNewsletterContact({
    email: parsed.data.email,
    name: parsed.data.name,
  });

  const stored = await saveNewsletterSubscriber({
    email: parsed.data.email,
    name: parsed.data.name,
    hubspotSynced: result.synced,
    hubspotContactId: result.synced ? result.contactId : null,
  });

  if (!result.synced) {
    console.warn(
      `[newsletter] no entregado a HubSpot (${result.reason}) para ${parsed.data.email}` +
        (stored ? " — guardado en DB para reintentar" : " — TAMPOCO se guardó en DB"),
    );
  }

  return NextResponse.json({ ok: true, delivered: result.synced, stored });
}
