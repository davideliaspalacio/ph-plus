import { test } from "@playwright/test";
import { seed, snap } from "./helpers/seed";

const BUCKET = "02-checkout";

test.describe("Checkout — flujo de compra", () => {
  test("checkout vacío", async ({ page }, info) => {
    await page.goto("/checkout");
    await snap(page, info, BUCKET, "01-checkout-sin-items");
  });

  test("checkout con items", async ({ page }, info) => {
    await seed(page, {
      cart: [
        { slug: "kit-inicial-botellon-19lts", quantity: 1 },
        { slug: "garrafa-1l-pack6", quantity: 1 },
      ],
    });
    await page.goto("/checkout");
    await snap(page, info, BUCKET, "02-checkout-form");
  });

  test("checkout con usuario logueado (prefill)", async ({ page }, info) => {
    await seed(page, {
      asCustomer: true,
      cart: [{ slug: "kit-inicial-botellon-19lts", quantity: 1 }],
    });
    await page.goto("/checkout");
    await snap(page, info, BUCKET, "03-checkout-logueado");
  });

  test("pedido confirmado / éxito", async ({ page }, info) => {
    await page.addInitScript(() => {
      sessionStorage.setItem(
        "phplus.lastOrder",
        JSON.stringify({
          orderId: "ORD-DEMO123",
          contact: {
            name: "Ada Lovelace",
            email: "ada@ph-plus.co",
            phone: "3001234567",
          },
          shipping: {
            address: "Calle 100 #15-20",
            city: "Bogotá",
            department: "Cundinamarca",
            notes: "",
          },
          payment: "credit_card",
          lines: [
            {
              slug: "kit-inicial-botellon-19lts",
              title: "Kit inicial 19L",
              quantity: 1,
              unit: 85_000,
              total: 85_000,
            },
          ],
          totals: { subtotal: 85_000, shipping: 8_000, total: 93_000 },
          createdAt: new Date().toISOString(),
        }),
      );
    });
    await page.goto("/checkout/exito?order=ORD-DEMO123");
    await snap(page, info, BUCKET, "04-pedido-confirmado");
  });
});
