import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.ts/,
  outputDir: "./screenshots/.playwright-output",
  /* Captura todo aunque algo falle: el objetivo es producir el set de imágenes. */
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "screenshots/.report", open: "never" }]],
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "mobile",
      use: {
        // Usamos Chromium con viewport y user-agent de iPhone 13 para
        // evitar tener que instalar Webkit. Visualmente equivalente para
        // screenshots de marketing.
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
