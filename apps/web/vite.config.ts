import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Keep the web app on VITE_API_URL=/api in dev too.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;

          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }

          // Match only the React runtime and router packages. A broad
          // `id.includes('react')` also catches libraries such as
          // lucide-react and @radix-ui/react-*, which then made
          // `vendor-react` import the generic `vendor` chunk — a circular
          // dependency that crashed the app at startup (React undefined).
          if (/[\\/]node_modules[\\/](?:react-dom|react-router-dom|react-router|react|scheduler|@remix-run[\\/]router)[\\/]/.test(id)) {
            return 'vendor-react';
          }

          return 'vendor';
        },
      },
    },
  },
})
