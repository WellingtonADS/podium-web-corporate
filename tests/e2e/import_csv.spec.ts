import { expect, test } from "@playwright/test";

test("import csv smoke - stub flow", async ({ page }) => {
  await page.goto("/login");
  // Only check that login page loads and import UI is reachable after auth in manual steps
  await expect(page.locator("text=Entrar").first()).toBeVisible();
});
