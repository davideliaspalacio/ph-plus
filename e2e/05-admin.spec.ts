import { test } from "@playwright/test";
import { seed, snap } from "./helpers/seed";

const BUCKET = "05-admin";

test.describe("Admin — login", () => {
  test("login admin", async ({ page }, info) => {
    await page.goto("/admin/login");
    await snap(page, info, BUCKET, "01-login");
  });

  test("guard sin sesión admin", async ({ page }, info) => {
    await page.goto("/admin");
    await snap(page, info, BUCKET, "02-guard-no-autorizado");
  });
});

test.describe("Admin — panel completo", () => {
  test.beforeEach(async ({ page }) => {
    await seed(page, {
      asAdmin: true,
      seedOrders: true,
      seedInventory: true,
    });
  });

  test("dashboard con KPIs", async ({ page }, info) => {
    await page.goto("/admin");
    await snap(page, info, BUCKET, "03-dashboard");
  });

  test("productos", async ({ page }, info) => {
    await page.goto("/admin/productos");
    await snap(page, info, BUCKET, "04-productos");
  });

  test("pedidos", async ({ page }, info) => {
    await page.goto("/admin/pedidos");
    await snap(page, info, BUCKET, "05-pedidos");
  });

  test("inventario", async ({ page }, info) => {
    await page.goto("/admin/inventario");
    await snap(page, info, BUCKET, "06-inventario");
  });

  test("clientes", async ({ page }, info) => {
    await page.goto("/admin/clientes");
    await snap(page, info, BUCKET, "07-clientes");
  });

  test("cupones", async ({ page }, info) => {
    await page.goto("/admin/cupones");
    await snap(page, info, BUCKET, "08-cupones");
  });

  test("zonas de envío", async ({ page }, info) => {
    await page.goto("/admin/envios");
    await snap(page, info, BUCKET, "09-zonas-envio");
  });

  test("reseñas", async ({ page }, info) => {
    await page.goto("/admin/resenas");
    await snap(page, info, BUCKET, "10-resenas");
  });

  test("contenido", async ({ page }, info) => {
    await page.goto("/admin/contenido");
    await snap(page, info, BUCKET, "11-contenido");
  });

  test("ajustes", async ({ page }, info) => {
    await page.goto("/admin/ajustes");
    await snap(page, info, BUCKET, "12-ajustes");
  });
});
