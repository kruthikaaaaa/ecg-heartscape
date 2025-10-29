import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Component tagging removed

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all addresses
    port: 3000,
    strictPort: true,
    open: true, // Open browser on start
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
