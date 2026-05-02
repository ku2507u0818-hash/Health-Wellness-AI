import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isBuild = process.argv.includes("build");

// PORT is only needed for the dev server, not for `vite build`
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

// BASE_PATH defaults to "/" for production builds (Vercel, etc.)
const basePath = process.env.BASE_PATH || "/";

// Backend URL for proxying in local dev (not needed in Replit — handled by the Replit proxy)
const apiServerPort = process.env.API_SERVER_PORT || "8080";

const plugins = [react(), tailwindcss()];

// Only load Replit-specific plugins inside the Replit environment
if (!isBuild && process.env.REPL_ID !== undefined) {
  const [{ default: runtimeErrorOverlay }, { cartographer }, { devBanner }] = await Promise.all([
    import("@replit/vite-plugin-runtime-error-modal"),
    import("@replit/vite-plugin-cartographer"),
    import("@replit/vite-plugin-dev-banner"),
  ]);
  plugins.push(
    runtimeErrorOverlay(),
    cartographer({ root: path.resolve(import.meta.dirname, "..") }),
    devBanner(),
  );
}

export default defineConfig({
  base: basePath,
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Proxy /api calls to the backend in local dev (outside Replit)
    proxy: process.env.REPL_ID
      ? undefined
      : {
          "/api": {
            target: `http://localhost:${apiServerPort}`,
            changeOrigin: true,
          },
        },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
