import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './build'
  },
  optimizeDeps: {
    exclude: ['@meforma/vue-toaster']
  },
  server: {
    host: '0.0.0.0'
  },
})
