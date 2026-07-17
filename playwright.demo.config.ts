import { defineConfig, devices } from "@playwright/test";

/**
 * Config dedicada al video de demo del flujo de compra.
 *
 * Separada de playwright.config.ts (el de screenshots) a propósito:
 *   - `testMatch: *.demo.ts` para que la suite de screenshots (`*.spec.ts`) NO
 *     lo levante, y viceversa.
 *   - `video: "on"` + `slowMo` para que el resultado sea presentable.
 *
 * Correr:  npx playwright test --config=playwright.demo.config.ts
 */

const BASE_URL = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e/demo",
  testMatch: /.*\.demo\.ts/,
  outputDir: "./demo-output",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 120_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    // Video de todo el recorrido, aunque el test pase (queremos la grabación).
    video: "on",
    // Más lento = legible en el video del demo.
    launchOptions: { slowMo: 350 },
  },
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
