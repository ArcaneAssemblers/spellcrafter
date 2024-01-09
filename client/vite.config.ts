import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/spellcrafter",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ren_client: resolve(__dirname, 'ren_client/index.html'),
      },
    },
  },
})
