/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/dr-denker-app/',
  build: {
    target: 'es2020',
    minify: 'terser'
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=5184000' // 2 months
    }
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=5184000' // 2 months
    }
  }
})
