import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = "./";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Anki Aero",
        short_name: "Anki Aero",
        description: "Offline ANAC quiz study cards with spaced repetition.",
        theme_color: "#0f172a",
        background_color: "#0b1120",
        display: "standalone",
        start_url: ".",
        scope: ".",
        icons: [
          {
            src: "pwa-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"]
      }
    })
  ]
});
