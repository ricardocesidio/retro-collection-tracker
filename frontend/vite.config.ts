/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': 'http://localhost:3000',
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
