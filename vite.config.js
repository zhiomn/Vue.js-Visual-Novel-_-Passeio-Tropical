import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // Esta linha instrui o Vite a construir todos os caminhos de assets
  // de forma relativa ao arquivo index.html. Isso garante que o build
  // funcione corretamente em qualquer servidor ou subdiretório.
  base: './', 

  plugins: [
    vue(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
