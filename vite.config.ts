import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5175,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "chakra-ui": [
            "@chakra-ui/react",
            "@emotion/react",
            "@emotion/styled",
          ],
          vendor: ["react", "react-dom", "react-router-dom"],
          http: ["axios"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
