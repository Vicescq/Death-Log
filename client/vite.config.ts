import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: true
      },
      registerType: "autoUpdate",
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
      injectRegister: 'auto',
      useCredentials: true
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      }
    }
  }
})
