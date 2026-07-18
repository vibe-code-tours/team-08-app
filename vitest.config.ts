import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // vite-plugin-pwa's VitePWA plugin (build/dev only, see vite.config.ts)
      // owns this virtual module; alias it to a stub for the test environment.
      'virtual:pwa-register/react': fileURLToPath(
        new URL('./src/test-mocks/pwa-register-react.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: true,
  },
})
