/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': 'http://localhost:3000',
      '/upload': 'http://localhost:3000',
      '/games': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/collections': 'http://localhost:3000',
      '/wishlist': 'http://localhost:3000',
      '/reviews': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/follow': 'http://localhost:3000',
      '/notifications': 'http://localhost:3000',
      '/notification-preferences': 'http://localhost:3000',
      '/activity': 'http://localhost:3000',
      '/stats': 'http://localhost:3000',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src/styles')],
        additionalData: `@use 'variables' as *;\n@use 'mixins' as *;\n`,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
