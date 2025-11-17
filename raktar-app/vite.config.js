// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['.trycloudflare.com'],
    hmr: {
      protocol: 'wss',
      host: 'finances-specification-islands-reception.trycloudflare.com', // aktuális tunnel címed
      clientPort: 443,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // ← backend port
        changeOrigin: true,
        secure: false,
        // ha a backend nem /api-vel kezdődik, akkor vedd ki a prefixet:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
