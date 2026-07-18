import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import type { Page } from "@playwright/test";

/**
 * Barrido de TODAS las rutas públicas cazando, por página:
 *   - errores de consola y excepciones no capturadas
 *   - requests con status >= 400
 *   - imágenes rotas (naturalWidth 0 tras scrollear la página completa)
 *   - overflow horizontal (el body no debe scrollear de costado, clave en mobile)
 *   - redirects (URL final ≠ URL pedida)
 *
 * No asserta: COLECTA. El resultado queda en audit-output/rutas-<proyecto>.json
 * para armar el informe. Un fallo de una página no corta el barrido.
 */

const RUTAS = [
  "/",
  "/productos",
  "/productos/botellon-19lts", // producto del catálogo del código
  "/productos/botellon-20l-premium", // producto creado SOLO en el admin (DB)
  "/carrito",
  "/checkout",
  "/checkout/exito?order=ORD-AUDIT",
  "/checkout/payu/respuesta",
  "/por-que-ph-plus",
  "/puntos-de-venta",
  "/envios",
  "/buscar",
  "/login",
  "/registro",
  "/cuenta",
  "/cuenta/pedidos",
  "/cuenta/direcciones",
  "/cuenta/favoritos",
  "/cuenta/perfil",
  "/politica-de-privacidad",
  "/politica-de-cambios",
  "/terminos-y-condiciones",
  "/admin/login",
  "/ruta-que-no-existe-404",
];

type PageReport = {
  ruta: string;
  finalUrl: string;
  consoleErrors: string[];
  pageErrors: string[];
  badResponses: string[];
  brokenImages: string[];
  horizontalOverflow: number | null;
};

async function auditRoute(page: Page, ruta: string): Promise<PageReport> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const badResponses = new Set<string>();

  const onConsole = (msg: import("@playwright/test").ConsoleMessage) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
  };
  const onPageError = (err: Error) => pageErrors.push(String(err).slice(0, 300));
  const onResponse = (res: import("@playwright/test").Response) => {
    if (res.status() >= 400) {
      badResponses.add(`${res.status()} ${res.url().replace(page.url(), "")}`.slice(0, 200));
    }
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  let finalUrl = "";
  let brokenImages: string[] = [];
  let horizontalOverflow: number | null = null;

  try {
    await page.goto(ruta, { waitUntil: "load", timeout: 20_000 });
    // Scrollear toda la página para disparar imágenes lazy.
    await page.evaluate(async () => {
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);

    finalUrl = page.url();
    brokenImages = await page.evaluate(() =>
      [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
        .map((img) => img.getAttribute("src") ?? "")
        .slice(0, 10),
    );
    horizontalOverflow = await page.evaluate(() => {
      const extra = document.documentElement.scrollWidth - window.innerWidth;
      return extra > 2 ? extra : null;
    });
  } catch (e) {
    pageErrors.push(`NAV FAIL: ${String(e).slice(0, 200)}`);
  }

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("response", onResponse);

  return {
    ruta,
    finalUrl,
    consoleErrors,
    pageErrors,
    badResponses: [...badResponses],
    brokenImages,
    horizontalOverflow,
  };
}

test("barrido de rutas", async ({ page }, info) => {
  const reports: PageReport[] = [];

  // Carrito sembrado para auditar /carrito con contenido real (incluye el
  // producto cuya miniatura está rota, para confirmarlo).
  await page.addInitScript(() => {
    localStorage.setItem(
      "phplus.cart.v1",
      JSON.stringify({
        state: {
          items: [
            { slug: "promocion-garrafas", quantity: 1 },
            { slug: "botellon-19lts", quantity: 2 },
          ],
        },
        version: 1,
      }),
    );
  });

  for (const ruta of RUTAS) {
    reports.push(await auditRoute(page, ruta));
  }

  mkdirSync("audit-output", { recursive: true });
  writeFileSync(
    `audit-output/rutas-${info.project.name}.json`,
    JSON.stringify(reports, null, 2),
  );
});
