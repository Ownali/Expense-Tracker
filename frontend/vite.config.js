import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // Raise the warning threshold — recharts alone is ~500kB minified
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better caching
        manualChunks(id) {
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3")) {
            return "vendor-charts";
          }
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "vendor-react";
          }
        },
      },
    },
  },
});
