import { expect, test } from "@playwright/test";

// This e2e test requires a running backend and frontend. It is a smoke test
// that creates a booking via UI and cancels it. Configure VITE_API_URL to point to the backend used in the test.

test("create -> verify -> cancel booking (smoke)", async ({ page }) => {
  // Visit login page and set token in localStorage to bypass auth in dev
  await page.goto("/login");

  // If login flow exists, you can replace this with form submit
  await page.evaluate(() => {
    localStorage.setItem("@Podium:token", "test-token");
  });

  // Go to bookings
  await page.goto("/bookings");

  await page.click("text=+ Nova Reserva");

  await page.fill('input[placeholder="Origem"]', "Av Teste 1");
  await page.fill('input[placeholder="Destino"]', "Rua Teste 2");

  // Select passenger (first option)
  await page.selectOption("select", "1");

  await page.click("text=Salvar");

  // Expect to find created booking in the table
  await expect(page.locator("text=Av Teste 1")).toBeVisible();

  // Cancel it
  await page.click("text=Cancelar");

  // Expect cancelled status
  await expect(page.locator("text=cancelled")).toBeVisible();
});
