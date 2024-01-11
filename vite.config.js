import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://learniverse-api.onrender.com/",
        // target: "http://localhost:5934/",
        changeOrigin: true,
      },
    },
  },
  build: { chunkSizeWarningLimit: 1600 },
});
