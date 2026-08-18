import { NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

export const runtime = "nodejs";

/**
 * Endpoint liviano para que la pantalla de retorno haga polling mientras
 * espera el webhook, sin recargar toda la página. A propósito devuelve
 * SOLO el status (ningún dato de contacto/envío/monto) — es información de
 * bajo riesgo, equivalente a lo que ya se ve en la URL de retorno, así que
 * no requiere verificación de email como el lookup completo de
 * `/api/orders/lookup`.
 */
export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
  }

  if (
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ status: null });
  }

  try {
    const supabase = await createSupabaseServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();
    return NextResponse.json({
      status: (data as { status?: string } | null)?.status ?? null,
    });
  } catch {
    return NextResponse.json({ status: null });
  }
}
