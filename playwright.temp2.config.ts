import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://10.2.0.2:5175",
    headless: true,
  },
});
