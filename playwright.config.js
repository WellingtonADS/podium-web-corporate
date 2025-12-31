/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: 2,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
};

module.exports = config;
