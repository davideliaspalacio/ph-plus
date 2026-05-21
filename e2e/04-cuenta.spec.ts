import { test } from "@playwright/test";
import { seed, snap } from "./helpers/seed";

const BUCKET = "04-cuenta";

test.describe("Cuenta del usuario", () => {
  test.beforeEach(async ({ page }) => {
    await seed(page, {
      asCustomer: true,
      seedOrders: true,
      wishlist: ["kit-inicial-botellon-19lts", "garrafa-1l-pack6"],
    });
  });

  test("resumen", async ({ page }, info) => {
    await page.goto("/cuenta");
    await snap(page, info, BUCKET, "01-resumen");
  });

  test("perfil", async ({ page }, info) => {
    await page.goto("/cuenta/perfil");
    await snap(page, info, BUCKET, "02-perfil");
  });

  test("direcciones (vacío)", async ({ page }, info) => {
    await page.goto("/cuenta/direcciones");
    await snap(page, info, BUCKET, "03-direcciones");
  });

  test("pedidos", async ({ page }, info) => {
    await page.goto("/cuenta/pedidos");
    await snap(page, info, BUCKET, "04-pedidos");
  });

  test("favoritos / wishlist", async ({ page }, info) => {
    await page.goto("/cuenta/favoritos");
    await snap(page, info, BUCKET, "05-favoritos");
  });
});

test.describe("Cuenta — sin sesión", () => {
  test("redirect/fallback al ir a /cuenta sin sesión", async ({ page }, info) => {
    await page.goto("/cuenta");
    await snap(page, info, BUCKET, "06-sin-sesion");
  });
});
