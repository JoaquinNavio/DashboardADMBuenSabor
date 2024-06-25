import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Suprimir advertencias específicas
    logOverride: { 'this-is-unsafe': 'silent' },
  },
  build: {
    sourcemap: false, // Esto puede ayudar a evitar ciertos errores relacionados con los mapas de origen
  }
})
