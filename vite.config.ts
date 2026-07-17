import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/team-08-app/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/TheChosenOneLogo.png'],
      manifest: {
        name: 'The Chosen One',
        short_name: 'The Chosen One',
        description:
          'A premium multiplayer party game — fingers on screen, spinning light, who will be chosen?',
        theme_color: '#8B2FE2',
        background_color: '#0A0414',
        display: 'standalone',
        icons: [
          { src: 'images/TheChosenOneLogo.png', sizes: '192x192', type: 'image/png' },
          { src: 'images/TheChosenOneLogo.png', sizes: '512x512', type: 'image/png' },
          { src: 'images/TheChosenOneLogo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
