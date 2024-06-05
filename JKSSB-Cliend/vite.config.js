import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@emotion/styled"],
  },
  build: {
    chunkSizeWarningLimit: 2000, // Increase the limit to 1000 kB
  },
});
