import { test, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

/**
 * Recorrido completo de compra para el video de demo, navegando con CLICKS
 * reales (nada de saltar de URL en URL): home → catálogo → agregar al carrito
 * → mini-carrito → checkout → PayU (sandbox).
 *
 * No se abre la ficha del producto: el producto se agrega directo desde el
 * catálogo con "comprar ahora".
 *
 * Además de grabar, valida lo que importa para el demo:
 *   - Se muestran productos (destacados + catálogo de la DB) con precios.
 *   - En el pago quedó SOLO PayU (sin contra entrega).
 *   - El flujo llega a la pasarela real de PayU en modo pruebas.
 */

/** Pausa corta para que el paso sea legible en la grabación. */
async function beat(page: Page, ms = 1100) {
  await page.waitForTimeout(ms);
}

/** El primer elemento VISIBLE del locator (los cards duplican variantes
 *  mobile/desktop, una de ellas oculta según el viewport). */
function vis(page: Page, locator: Locator): Locator {
  return locator.and(page.locator(":visible")).first();
}

test("Flujo de compra completo (demo)", async ({ page }) => {
  // ── 1. Home ────────────────────────────────────────────────────────────
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /productos destacados/i }),
  ).toBeVisible();
  await beat(page);

  // ── 2. Ir al catálogo desde el menú (click real) ───────────────────────
  await vis(page, page.getByRole("link", { name: "PRODUCTOS", exact: true })).click();
  await page.waitForURL(/\/productos\/?$/);
  await expect(
    page.getByRole("heading", { name: /todo el catálogo/i }),
  ).toBeVisible({ timeout: 15_000 });
  // Hay precios pintados (uno por producto).
  expect(await page.getByText(/\$\s?\d{2}\.\d{3}/).count()).toBeGreaterThan(3);
  await beat(page);

  // ── 3. Agregar al carrito directo desde el catálogo (sin abrir la ficha) ─
  await vis(page, page.getByRole("button", { name: /comprar ahora/i })).click();
  await beat(page, 900);

  // ── 4. Abrir el mini-carrito y verificar que se agregó ─────────────────
  await vis(page, page.getByRole("button", { name: /^abrir carrito/i })).click();
  await expect(vis(page, page.getByRole("link", { name: /^pagar$/i }))).toBeVisible();
  await beat(page);

  // ── 5. Ir a pagar (click real) ─────────────────────────────────────────
  await vis(page, page.getByRole("link", { name: /^pagar$/i })).click();
  await page.waitForURL(/\/checkout\/?$/);
  await expect(
    page.getByRole("heading", { name: /completa tu compra/i }),
  ).toBeVisible({ timeout: 15_000 });

  // ── 6. Datos del comprador (invitado) ──────────────────────────────────
  await page.locator("#guest-name").fill("Ada Lovelace");
  await page.locator("#guest-email").fill("ada.demo@ph-plus.co");
  await page.locator("#guest-phone").fill("3001234567");
  await page.locator("#guest-address").fill("Calle 100 #15-20, Apto 502");
  await page.locator("#guest-city").fill("Bogotá");
  await page.locator("#guest-department").selectOption("Cundinamarca");
  await beat(page, 900);

  await page.getByRole("button", { name: /ir al pago/i }).click();

  // ── 7. Pago: SOLO PayU ─────────────────────────────────────────────────
  await expect(page.getByText(/pago en línea con payu/i)).toBeVisible();
  await expect(page.getByText(/contra entrega/i)).toHaveCount(0);
  await beat(page);

  await page.getByRole("button", { name: /^continuar$/i }).click();

  // ── 8. Revisar ─────────────────────────────────────────────────────────
  await expect(
    page.getByRole("heading", { name: /confirma tu pedido/i }),
  ).toBeVisible();
  await beat(page);

  // ── 9. Pagar → pasarela PayU ───────────────────────────────────────────
  await page.getByRole("button", { name: /pagar con payu/i }).click();

  // El overlay de carga aparece mientras se prepara el pago (subtítulo único).
  await expect(
    page.getByText(/te estamos redirigiendo a la pasarela/i),
  ).toBeVisible();

  await page.waitForURL(/sandbox\.checkout\.payulatam\.com/, {
    timeout: 30_000,
  });
  await expect(
    page.getByText(/transacción en modo de pruebas/i).first(),
  ).toBeVisible({ timeout: 20_000 });
  await beat(page, 2000);
});
