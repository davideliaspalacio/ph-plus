import type { Page, TestInfo } from "@playwright/test";

/**
 * Inyecta data semilla en localStorage ANTES de que cargue la app.
 * Esto nos permite sacar screenshots con:
 *  - Sesión de cliente activa (para /cuenta/*)
 *  - Sesión de admin activa (para /admin/*)
 *  - Carrito con items
 *  - Wishlist con items
 *  - Pedidos seed para que el dashboard admin se vea poblado
 *
 * IMPORTANTE: esto corre como un initScript, antes de cualquier código de la página.
 */

export type SeedOptions = {
  /** Logueado como customer normal */
  asCustomer?: boolean;
  /** Logueado como super_admin */
  asAdmin?: boolean;
  /** Items en el carrito por slug. */
  cart?: Array<{ slug: string; quantity: number }>;
  /** Slugs en wishlist. */
  wishlist?: string[];
  /** Sembrar 8 pedidos para el dashboard admin. */
  seedOrders?: boolean;
  /** Sembrar inventario para todos los productos del catálogo. */
  seedInventory?: boolean;
};

const CUSTOMER = {
  id: "u-customer-1",
  email: "ada@ph-plus.co",
  name: "Ada Lovelace",
  role: "customer",
  passwordHash: "$seed$",
  createdAt: "2026-04-01T10:00:00.000Z",
};

const ADMIN = {
  id: "u-admin-1",
  email: "admin@ph-plus.co",
  name: "María Admin",
  role: "super_admin",
  passwordHash: "$seed$",
  createdAt: "2026-01-01T10:00:00.000Z",
};

const SAMPLE_ORDERS = [
  { status: "pending_payment", total: 36_000, items: 1 },
  { status: "pending_payment", total: 72_000, items: 2 },
  { status: "paid", total: 148_000, items: 1 },
  { status: "paid", total: 54_000, items: 3 },
  { status: "preparing", total: 280_000, items: 1 },
  { status: "shipped", total: 65_000, items: 2 },
  { status: "delivered", total: 36_000, items: 1 },
  { status: "cancelled", total: 18_000, items: 1 },
];

const ORDER_LINE_SLUGS = [
  "botellon-19lts",
  "garrafa-1l-pack6",
  "dispensador-manual",
];
const ORDER_LINE_TITLES = [
  "Botellón 19L",
  "Garrafa 1L pack x6",
  "Dispensador manual",
];

export async function seed(page: Page, options: SeedOptions = {}) {
  await page.addInitScript(
    ({ options, CUSTOMER, ADMIN, SAMPLE_ORDERS }) => {
      const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;

      if (options.asAdmin) {
        localStorage.setItem(
          "phplus.session",
          JSON.stringify({
            state: {
              session: { userId: ADMIN.id, role: ADMIN.role, expiresAt: exp },
            },
            version: 1,
          }),
        );
        localStorage.setItem(
          `phplus.db.users.v1:${ADMIN.id}`,
          JSON.stringify(ADMIN),
        );
      } else if (options.asCustomer) {
        localStorage.setItem(
          "phplus.session",
          JSON.stringify({
            state: {
              session: {
                userId: CUSTOMER.id,
                role: CUSTOMER.role,
                expiresAt: exp,
              },
            },
            version: 1,
          }),
        );
        localStorage.setItem(
          `phplus.db.users.v1:${CUSTOMER.id}`,
          JSON.stringify(CUSTOMER),
        );
      }

      if (options.cart && options.cart.length) {
        localStorage.setItem(
          "phplus.cart.v1",
          JSON.stringify({
            state: { items: options.cart },
            version: 1,
          }),
        );
      }

      if (options.wishlist && options.wishlist.length) {
        localStorage.setItem(
          "phplus.wishlist.v1",
          JSON.stringify({
            state: {
              items: options.wishlist.map((slug) => ({
                slug,
                addedAt: new Date().toISOString(),
              })),
            },
            version: 1,
          }),
        );
      }

      if (options.seedOrders) {
        const userId = options.asAdmin ? ADMIN.id : CUSTOMER.id;
        const now = Date.now();
        SAMPLE_ORDERS.forEach((o, i) => {
          const id = `ORD-DEMO${String(i + 1).padStart(3, "0")}`;
          const createdAt = new Date(now - (i + 1) * 86_400_000).toISOString();
          const lineCount = o.items;
          const unit = Math.round(o.total / lineCount);
          const lines = Array.from({ length: lineCount }).map((_, j) => ({
            slug: ["botellon-19lts", "dispensador-manual", "garrafa-1l-pack6"][
              j % 3
            ],
            title: ["Botellón 19L Premium", "Kit dispensador", "Garrafa 5L x6"][
              j % 3
            ],
            quantity: 1,
            unitPrice: unit,
            lineTotal: unit,
          }));
          const order = {
            id,
            userId: i < 3 ? userId : "u-customer-other",
            status: o.status,
            lines,
            totals: {
              subtotal: o.total,
              discount: 0,
              shipping: o.total >= 120_000 ? 0 : 8_000,
              total: o.total + (o.total >= 120_000 ? 0 : 8_000),
            },
            contact: {
              name: i % 2 === 0 ? "Ada Lovelace" : "Linus Torvalds",
              email: i % 2 === 0 ? "ada@ph-plus.co" : "linus@kernel.org",
              phone: "3001234567",
            },
            shipping: {
              address: "Calle 100 #15-20",
              city: "Bogotá",
              department: "Cundinamarca",
              postalCode: "110111",
              notes: "",
            },
            payment: { method: i % 3 === 0 ? "credit_card" : "pse" },
            notes: [],
            createdAt,
            updatedAt: createdAt,
          };
          localStorage.setItem(
            `phplus.db.orders.v1:${id}`,
            JSON.stringify(order),
          );
        });
      }

      if (options.seedInventory) {
        const slugs = [
          "botellon-19lts",
          "recarga-19lts-individual",
          "dispensador-manual",
          "garrafa-1l-pack6",
          "garrafa-1-5l-pack6",
          "recargas-19lts",
        ];
        slugs.forEach((slug, idx) => {
          const sku = `SKU-${slug.toUpperCase()}`;
          const stock = (idx + 2) * 7;
          localStorage.setItem(
            `phplus.db.inventory.stock.v1:${sku}`,
            JSON.stringify({
              sku,
              productSlug: slug,
              current: stock,
              low: 5,
            }),
          );
        });
      }
    },
    { options, CUSTOMER, ADMIN, SAMPLE_ORDERS },
  );
}

/**
 * Snap helper: pone delay para que terminen animaciones y guarda screenshot
 * con nombre estable bajo la carpeta del bucket.
 */
export async function snap(
  page: Page,
  testInfo: TestInfo,
  bucket: string,
  name: string,
  opts: { fullPage?: boolean; waitMs?: number } = {},
) {
  const { fullPage = true, waitMs = 350 } = opts;
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(waitMs);
  const viewport = testInfo.project.name; // "desktop" | "mobile"
  const path = `screenshots/${viewport}/${bucket}/${name}.png`;
  await page.screenshot({ path, fullPage });
}
