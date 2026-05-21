import { test } from "@playwright/test";
import { seed, snap } from "./helpers/seed";

const BUCKET = "01-storefront";

test.describe("Storefront — flujos de tienda", () => {
  test("home", async ({ page }, info) => {
    await page.goto("/");
    await snap(page, info, BUCKET, "01-home");
  });

  test("listado de productos", async ({ page }, info) => {
    await page.goto("/productos");
    await snap(page, info, BUCKET, "02-productos");
  });

  test("detalle de producto (PDP)", async ({ page }, info) => {
    await page.goto("/productos/kit-inicial-botellon-19lts");
    await snap(page, info, BUCKET, "03-pdp");
  });

  test("búsqueda con resultados", async ({ page }, info) => {
    await page.goto("/buscar?q=botellon");
    await snap(page, info, BUCKET, "04-buscar-resultados");
  });

  test("búsqueda vacía", async ({ page }, info) => {
    await page.goto("/buscar");
    await snap(page, info, BUCKET, "05-buscar-vacio");
  });

  test("envíos / zonas y FAQ", async ({ page }, info) => {
    await page.goto("/envios");
    await snap(page, info, BUCKET, "06-envios");
  });

  test("carrito vacío", async ({ page }, info) => {
    await page.goto("/carrito");
    await snap(page, info, BUCKET, "07-carrito-vacio");
  });

  test("carrito con items", async ({ page }, info) => {
    await seed(page, {
      cart: [
        { slug: "kit-inicial-botellon-19lts", quantity: 1 },
        { slug: "garrafa-1l-pack6", quantity: 2 },
      ],
    });
    await page.goto("/carrito");
    await snap(page, info, BUCKET, "08-carrito-con-items");
  });
});
