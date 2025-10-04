import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Rogue Clicker RPG',
        short_name: 'Rogue Clicker',
        description: 'Nowoczesna gra przeglądarkowa Rogue Clicker RPG z systemem walki, umiejętności i craftowania',
        theme_color: '#7c3aed',
        background_color: '#1e1b4b',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/RL-clicker/',
        start_url: '/RL-clicker/',
        icons: [
          {
            src: 'icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
  base: '/RL-clicker/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
