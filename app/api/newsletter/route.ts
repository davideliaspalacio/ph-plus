import { NextResponse } from "next/server";
import { z } from "zod";

import { subscribeNewsletterContact } from "@/app/lib/hubspot-server";

export const runtime = "nodejs";

const newsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().max(80).optional(),
});

/**
 * Alta de suscriptor al newsletter → contacto en HubSpot (lifecycle
 * `subscriber`). Si HubSpot no está configurado, responde 200 con
 * `delivered: false` para que el formulario no muestre error; el server loguea
 * que no se entregó. Cuando se cargue el token, empieza a entregar solo.
 */
export async function POST(request: Request) {
  const parsed = newsletterSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email inválido" },
      { status: 400 },
    );
  }

  const result = await subscribeNewsletterContact({
    email: parsed.data.email,
    name: parsed.data.name,
  });

  if (!result.synced) {
    console.warn(
      `[newsletter] no entregado a HubSpot (${result.reason}) para ${parsed.data.email}`,
    );
  }

  return NextResponse.json({ ok: true, delivered: result.synced });
}
