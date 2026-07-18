import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import type { Locator, Page } from "@playwright/test";

/**
 * Flujos interactivos, en desktop Y mobile. Cada flujo corre en try/catch y
 * COLECTA el resultado (ok / fallo + detalle) en audit-output/flujos-*.json:
 * un flujo roto no corta la auditoría de los demás.
 */

type FlowResult = { flujo: string; ok: boolean; detalle: string };

function vis(page: Page, locator: Locator): Locator {
  return locator.and(page.locator(":visible")).first();
}

async function run(
  results: FlowResult[],
  flujo: string,
  fn: () => Promise<string>,
) {
  try {
    const detalle = await fn();
    results.push({ flujo, ok: true, detalle });
  } catch (e) {
    results.push({ flujo, ok: false, detalle: String(e).slice(0, 400) });
  }
}

test("flujos interactivos", async ({ page }, info) => {
  const results: FlowResult[] = [];

  // ── F1: agregar al carrito desde el catálogo + badge + mini-carrito ─────
  await run(results, "F1 agregar al carrito + mini-carrito", async () => {
    await page.goto("/productos");
    await vis(page, page.getByRole("button", { name: /comprar ahora/i })).click();
    await page.waitForTimeout(600);
    await vis(page, page.getByRole("button", { name: /^abrir carrito/i })).click();
    await expect(vis(page, page.getByText(/tu carrito \(\d+\)/i))).toBeVisible({
      timeout: 5000,
    });
    return "producto agregado y mini-carrito abierto";
  });

  // ── F2: cantidades y quitar en el mini-carrito ──────────────────────────
  await run(results, "F2 cambiar cantidad y quitar (mini-carrito)", async () => {
    await vis(page, page.getByRole("button", { name: "Aumentar cantidad" })).click();
    await page.waitForTimeout(400);
    await vis(page, page.getByRole("button", { name: "Disminuir cantidad" })).click();
    await page.waitForTimeout(400);
    await vis(page, page.getByRole("button", { name: /^quitar$/i })).click();
    await expect(
      vis(page, page.getByText(/tu carrito está vacío/i)),
    ).toBeVisible({ timeout: 5000 });
    return "aumentar/disminuir/quitar funcionan; queda estado vacío";
  });

  // ── F3: validación del checkout invitado (submit vacío) ─────────────────
  await run(results, "F3 validación de checkout (campos vacíos)", async () => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "phplus.cart.v1",
        JSON.stringify({
          state: { items: [{ slug: "botellon-19lts", quantity: 1 }] },
          version: 1,
        }),
      );
    });
    await page.goto("/checkout");
    await expect(
      page.getByRole("heading", { name: /completa tu compra/i }),
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: /ir al pago/i }).click();
    await expect(page.getByText(/ingresa tu nombre completo/i)).toBeVisible();
    await expect(page.getByText(/email no válido/i)).toBeVisible();
    // Debe seguir en el paso de datos, no avanzar.
    if (!/\/checkout/.test(page.url())) throw new Error("avanzó sin validar");
    return "errores visibles y no avanza";
  });

  // ── F4: login con credenciales malas → error visible ────────────────────
  await run(results, "F4 login con credenciales inválidas", async () => {
    await page.goto("/login");
    await vis(page, page.locator('input[type="email"]')).fill("noexiste@test.co");
    await vis(page, page.locator('input[type="password"]')).fill("malaclave123");
    await vis(page, page.locator('button[type="submit"]')).click();
    await expect(
      page.getByText(/no pudimos iniciar|credencial|inválid/i).first(),
    ).toBeVisible({ timeout: 10_000 });
    return "muestra error, no cuelga";
  });

  // ── F5: admin login con credenciales malas → error visible ──────────────
  await run(results, "F5 admin login con credenciales inválidas", async () => {
    await page.goto("/admin/login");
    await vis(page, page.locator('input[type="email"]')).fill("fake@test.co");
    await vis(page, page.locator('input[type="password"]')).fill("malaclave123");
    await vis(page, page.locator('button[type="submit"]')).click();
    await expect(
      page.getByText(/incorrect|no pudimos|inválid|error/i).first(),
    ).toBeVisible({ timeout: 10_000 });
    return "muestra error, no cuelga";
  });

  // ── F6: newsletter con email inválido → error, no explota ───────────────
  await run(results, "F6 newsletter email inválido", async () => {
    await page.goto("/");
    const input = vis(page, page.locator("#newsletter-email"));
    await input.scrollIntoViewIfNeeded();
    await input.fill("esto-no-es-un-email");
    await vis(page, page.getByRole("button", { name: /suscribirme/i })).click();
    await expect(page.getByText(/email válido/i)).toBeVisible({ timeout: 5000 });
    return "valida el email y muestra error";
  });

  // ── F7: búsqueda desde el header ────────────────────────────────────────
  await run(results, "F7 búsqueda", async () => {
    await page.goto("/");
    await vis(page, page.getByRole("button", { name: /abrir búsqueda/i })).click();
    const box = vis(page, page.locator('input[type="search"], input[type="text"]'));
    await box.fill("botellón");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500);
    const crashed = await page
      .getByText(/application error|unhandled/i)
      .count();
    if (crashed > 0) throw new Error("crash tras buscar");
    return `busca sin crash (${page.url()})`;
  });

  // ── F8: /por-que-ph-plus tiene sus 2 videos ─────────────────────────────
  await run(results, "F8 videos en por-que-ph-plus", async () => {
    await page.goto("/por-que-ph-plus");
    const videos = await page.locator("video[src]").count();
    if (videos < 2) throw new Error(`solo ${videos} videos con src`);
    return `${videos} videos presentes`;
  });

  mkdirSync("audit-output", { recursive: true });
  writeFileSync(
    `audit-output/flujos-${info.project.name}.json`,
    JSON.stringify(results, null, 2),
  );

  // El test en sí no falla: es un recolector. El informe se arma del JSON.
});
