import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/generate-apk': 'http://localhost:3000',
      '/generate-apk-zip': 'http://localhost:3000',
    }
  }
})
