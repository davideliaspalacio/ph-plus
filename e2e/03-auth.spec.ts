import { test } from "@playwright/test";
import { snap } from "./helpers/seed";

const BUCKET = "03-auth";

test.describe("Auth — login y registro", () => {
  test("login", async ({ page }, info) => {
    await page.goto("/login");
    await snap(page, info, BUCKET, "01-login");
  });

  test("registro", async ({ page }, info) => {
    await page.goto("/registro");
    await snap(page, info, BUCKET, "02-registro");
  });
});
