import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src/styles')],
        includePaths: [path.resolve(__dirname, 'src/styles')],
        additionalData: `@use 'variables' as *;\n@use 'mixins' as *;\n`,
      },
    },
  },
})
