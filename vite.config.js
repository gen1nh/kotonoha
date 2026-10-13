import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy = {
    "/api/ai": {
      target: env.OMNIROUTE_URL || "http://127.0.0.1:20128",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/ai/, "/v1"),
      headers:
        env.OMNIROUTE_KEY
          ? {
              Authorization: `Bearer ${env.OMNIROUTE_KEY}`,
            }
          : {},
    },
  };
  return {
    server: { proxy },
    preview: { proxy },
    base: "/",
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        manifest: false,
        includeAssets: ["icon.svg", "manifest.webmanifest"],
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,woff2}"],
          cleanupOutdatedCaches: true,
        },
      }),
    ],
  };
});
