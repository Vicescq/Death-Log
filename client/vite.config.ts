import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from "dotenv";
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
      },
      manifest: {
        name: "DeathLog",
        short_name: 'DeathLog',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'reaper-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'reaper-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.CURRENT_API,
        changeOrigin: true,
      }
    }
  }
})
