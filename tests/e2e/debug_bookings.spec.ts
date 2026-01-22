import { test } from "@playwright/test";

test("debug bookings page", async ({ page }) => {
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  await page.goto("/login");
  await page.evaluate(() =>
    localStorage.setItem("@Podium:token", "test-token"),
  );
  await page.goto("/bookings");
  // Wait for root element to mount
  await page.waitForSelector("text=Reservas", { timeout: 5000 });
  // Wait a bit for client-side rendering
  await page.waitForTimeout(500);
  const html = await page.content();
  console.log("\n--- PAGE HTML START ---\n");
  console.log(html.slice(0, 8000));
  console.log("\n--- PAGE HTML END ---\n");
  await page.screenshot({
    path: "test-results/debug_bookings.png",
    fullPage: true,
  });
});
