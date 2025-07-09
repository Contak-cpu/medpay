import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimizaciones de build
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          utils: ['zustand']
        }
      }
    },
    // Optimizaciones de CSS
    cssCodeSplit: true,
    // Optimizaciones de assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  // Optimizaciones de desarrollo
  server: {
    hmr: {
      overlay: false // Deshabilitar overlay de errores para mejor performance
    }
  },
  // Optimizaciones de preview
  preview: {
    port: 4173,
    strictPort: true
  },
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'zustand']
  }
})
