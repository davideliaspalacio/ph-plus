import { test } from "@playwright/test";
import { seed, snap } from "./helpers/seed";

const BUCKET = "06-interacciones";

test.describe("Interacciones — drawers, modales y estados", () => {
  test("mini-cart drawer abierto (vacío)", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir carrito/i }).click();
    await page.waitForTimeout(400);
    await snap(page, info, BUCKET, "01-mini-cart-vacio", { fullPage: false });
  });

  test("mini-cart drawer abierto (con items)", async ({ page }, info) => {
    await seed(page, {
      cart: [
        { slug: "kit-inicial-botellon-19lts", quantity: 1 },
        { slug: "garrafa-1l-pack6", quantity: 2 },
      ],
    });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir carrito/i }).click();
    await page.waitForTimeout(400);
    await snap(page, info, BUCKET, "02-mini-cart-con-items", {
      fullPage: false,
    });
  });

  test("agregar producto nuevo desde admin (modal)", async ({ page }, info) => {
    await seed(page, { asAdmin: true });
    await page.goto("/admin/productos");
    const createBtn = page.getByRole("button", { name: /crear producto/i }).first();
    await createBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    await createBtn.click().catch(() => {});
    await page.waitForTimeout(500);
    await snap(page, info, BUCKET, "03-admin-crear-producto-modal", {
      fullPage: false,
    });
  });

  test("ajustar inventario (modal)", async ({ page }, info) => {
    await seed(page, { asAdmin: true, seedInventory: true });
    await page.goto("/admin/inventario");
    const ajustarBtn = page.getByRole("button", { name: /ajustar/i }).first();
    await ajustarBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    await ajustarBtn.click().catch(() => {});
    await page.waitForTimeout(500);
    await snap(page, info, BUCKET, "04-admin-ajustar-stock-modal", {
      fullPage: false,
    });
  });

  test("agregar dirección (modal)", async ({ page }, info) => {
    await seed(page, { asCustomer: true });
    await page.goto("/cuenta/direcciones");
    const addBtn = page.getByRole("button", { name: /agregar dirección/i }).first();
    await addBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    await addBtn.click().catch(() => {});
    await page.waitForTimeout(500);
    await snap(page, info, BUCKET, "05-cuenta-agregar-direccion-modal", {
      fullPage: false,
    });
  });

  test("wishlist activado en una card de producto", async ({ page }, info) => {
    await page.goto("/productos");
    await page.waitForLoadState("networkidle").catch(() => {});
    // El botón de favoritos vive dentro de las ProductCard del catálogo
    // (no en /. Esperamos a que la grilla cargue.
    await page.waitForTimeout(800);
    const heart = page
      .getByRole("button", { name: /agregar a favoritos|quitar de favoritos/i })
      .first();
    if (await heart.count()) {
      await heart.click({ force: true }).catch(() => {});
      await page.waitForTimeout(400);
    }
    await snap(page, info, BUCKET, "06-wishlist-activo");
  });
});
