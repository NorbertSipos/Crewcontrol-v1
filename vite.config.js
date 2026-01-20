import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Enable text compression (gzip) for better performance
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      // Compress files larger than 1kb
      threshold: 1024,
      // Only compress in production builds
      deleteOriginFile: false,
      // Files to compress
      filter: /\.(js|mjs|json|css|html|svg|xml|txt)$/i,
    }),
  ],
  build: {
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          // Feature chunks
          'dashboard': ['./src/components/Dashboard.jsx'],
          'auth': [
            './src/components/SignIn.jsx',
            './src/components/SignUp.jsx',
            './src/components/CompleteSignup.jsx'
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})