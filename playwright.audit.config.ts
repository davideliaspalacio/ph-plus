import { defineConfig, devices } from "@playwright/test";

/**
 * Config de AUDITORÍA: barre todas las rutas y flujos en desktop y mobile
 * cazando errores de consola, requests fallidas, imágenes rotas y overflow.
 *
 * Separada de las otras configs (`*.spec.ts` = screenshots, `*.demo.ts` =
 * video demo) vía testMatch `*.audit.ts`.
 *
 * Correr:  npx playwright test --config=playwright.audit.config.ts
 */

const BASE_URL = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e/audit",
  testMatch: /.*\.audit\.ts/,
  outputDir: "./audit-output/.artifacts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 300_000,
  use: {
    baseURL: BASE_URL,
    headless: true,
    video: "off",
    screenshot: "off",
    trace: "off",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
