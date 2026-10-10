import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const enviarCorreo = vi.fn();
vi.mock("@/app/lib/correos/enviar", () => ({ enviarCorreo: (...a: unknown[]) => enviarCorreo(...a) }));

let sessionUser: { id: string; email: string } | null = null;
let role: string | null = null;
vi.mock("@/src/shared/supabase/server", () => ({
  createSupabaseServerClient: async () => ({
    auth: { getUser: async () => ({ data: { user: sessionUser } }) },
  }),
  createSupabaseServiceClient: async () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: role ? { role } : null }) }) }),
    }),
  }),
}));

import { POST } from "./route";

describe("POST /api/admin/probar-correos", () => {
  beforeEach(() => {
    enviarCorreo.mockReset();
    enviarCorreo.mockResolvedValue({ sent: true, provider: "zeptomail" });
    process.env.NEXT_PUBLIC_DATA_BACKEND = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    delete process.env.CORREO_PEDIDOS;
    sessionUser = null;
    role = null;
  });

  it("401 sin sesión y no envía nada", async () => {
    const res = await POST();
    expect(res.status).toBe(401);
    expect(enviarCorreo).not.toHaveBeenCalled();
  });

  it("403 si la sesión no es de un administrador", async () => {
    sessionUser = { id: "u1", email: "cliente@x.co" };
    role = "customer";
    const res = await POST();
    expect(res.status).toBe(403);
    expect(enviarCorreo).not.toHaveBeenCalled();
  });

  it("envía el aviso interno y la confirmación al correo de la sesión, marcados [PRUEBA]", async () => {
    sessionUser = { id: "a1", email: "admin@aguaphplus.com" };
    role = "super_admin";
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(enviarCorreo).toHaveBeenCalledTimes(2);
    const calls = enviarCorreo.mock.calls.map((c) => c[0] as { to: unknown; subject: string });
    expect(calls.every((c) => c.subject.startsWith("[PRUEBA]"))).toBe(true);
    expect(calls.some((c) => c.to === "admin@aguaphplus.com")).toBe(true);
    expect(body.avisoInterno.a).toEqual(["comercial2@aguaphplus.com", "davideliaspalacioo@gmail.com"]);
    expect(body.confirmacionCliente).toMatchObject({ a: "admin@aguaphplus.com", enviado: true });
  });

  it("informa el motivo cuando el proveedor falla", async () => {
    sessionUser = { id: "a1", email: "admin@aguaphplus.com" };
    role = "staff";
    enviarCorreo.mockResolvedValue({ sent: false, reason: "Sin proveedor de correo" });
    const body = await (await POST()).json();
    expect(body.avisoInterno).toMatchObject({ enviado: false, motivo: "Sin proveedor de correo" });
  });
});
