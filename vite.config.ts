import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const localApi = "http://localhost:5050";
// Use production API only when explicitly set (e.g. no Docker). With Docker: npm run dev:docker
const devApi = process.env.VITE_DEV_API_PROXY?.trim() || localApi;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: devApi,
        changeOrigin: true,
        secure: true,
      },
      "/uploads": {
        target: devApi,
        changeOrigin: true,
        secure: true,
      },
      "/images/maps": {
        target: devApi,
        changeOrigin: true,
        secure: true,
      },
      "/biographies": {
        target: devApi,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
