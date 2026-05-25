/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

function skipHtml(req: IncomingMessage, res: ServerResponse): string | void | null | undefined {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    return '/index.html';
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-192x192.png', 'favicon-512x512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Retro Collection Tracker',
        short_name: 'Retro Tracker',
        description: 'Track your retro game collection, trade with collectors, and earn XP',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/retro-collection-tracker\.onrender\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/ws': { target: 'http://localhost:3000', ws: true },
      '/socket.io': { target: 'http://localhost:3000', ws: true },
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
      '/messages': { target: 'http://localhost:3000', bypass: skipHtml },
      '/trade': { target: 'http://localhost:3000', bypass: skipHtml },
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
