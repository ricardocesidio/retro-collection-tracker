/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

function skipHtml(req: IncomingMessage, res: ServerResponse): string | void | null | undefined {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    return '/index.html';
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': { target: 'http://localhost:3000', bypass: skipHtml },
      '/upload': { target: 'http://localhost:3000', bypass: skipHtml },
      '/games': { target: 'http://localhost:3000', bypass: skipHtml },
      '/auth': { target: 'http://localhost:3000', bypass: skipHtml },
      '/collections': { target: 'http://localhost:3000', bypass: skipHtml },
      '/wishlist': { target: 'http://localhost:3000', bypass: skipHtml },
      '/reviews': { target: 'http://localhost:3000', bypass: skipHtml },
      '/users': { target: 'http://localhost:3000', bypass: skipHtml },
      '/follow': { target: 'http://localhost:3000', bypass: skipHtml },
      '/notifications': { target: 'http://localhost:3000', bypass: skipHtml },
      '/notification-preferences': { target: 'http://localhost:3000', bypass: skipHtml },
      '/activity': { target: 'http://localhost:3000', bypass: skipHtml },
      '/stats': { target: 'http://localhost:3000', bypass: skipHtml },
      '/admin': { target: 'http://localhost:3000', bypass: skipHtml },
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
