import { expect, test } from "@playwright/test";

// This e2e test requires a running backend and frontend. It is a smoke test
// that creates a booking via UI and cancels it. Configure VITE_API_URL to point to the backend used in the test.

test("create -> verify -> cancel booking (smoke)", async ({ page }) => {
  // Visit login page and set token in localStorage to bypass auth in dev
  await page.goto("/login");

  // If login flow exists, you can replace this with form submit
  // Use E2E token from env if provided, otherwise fallback to test-token
  await page.evaluate((token) => {
    localStorage.setItem("@Podium:token", token || "test-token");
  }, process.env.E2E_TOKEN);

  // Go to bookings
  await page.goto("/bookings");

  await page.click("text=+ Nova Reserva");

  // Note: AddressAutocomplete now requires Google Places API integration
  // In a real e2e test, you would:
  // 1. Type in the origin input field
  // 2. Wait for Google Places autocomplete suggestions to appear
  // 3. Click on a suggestion to select it
  // 4. Repeat for destination
  //
  // For now, fill the input fields and wait for autocomplete suggestions
  const originInput = page
    .locator('input[placeholder="Rua, número, bairro - Cidade"]')
    .first();
  await originInput.fill("Av Paulista, 1000");

  // Wait for autocomplete suggestions (this would require Google Places API to be configured)
  // In testing environment, you may need to mock the Google Places API response
  await page.waitForTimeout(500);

  const destInput = page
    .locator('input[placeholder="Rua, número, bairro - Cidade"]')
    .nth(1);
  await destInput.fill("Rua Augusta, 200");

  await page.waitForTimeout(500);

  // Select passenger (first option)
  await page.selectOption("select", "1");

  await page.click("text=Salvar");

  // Expect to find created booking in the table
  // Note: The actual coordinate values will depend on the Google Places API response
  await expect(page.locator("text=Av Paulista, 1000")).toBeVisible({
    timeout: 10000,
  });

  // Cancel it
  await page.click("text=Cancelar");

  // Expect cancelled status
  await expect(page.locator("text=cancelled")).toBeVisible();
});
