import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
import mkcert from 'vite-plugin-mkcert'
import vue from '@vitejs/plugin-vue'
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(
    {
      template: {
        compilerOptions: {
          isCustomElement: tag => ["header", "content"].includes(tag),
        }
      }
    }
  ), mkcert(), VitePWA({
    registerType: "autoUpdate",
    injectRegister: 'auto',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
      cleanupOutdatedCaches: true
    },
    manifest: {
      name: "Attend Appp",
      short_name: "Attend",
      theme_color: "#5864e0",
      start_url: "/",
      display: "standalone",
      background_color: "#E8EBED",
      icons: [
        {
          src: "img/icons/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "img/icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    }
  }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 8080
  }
})