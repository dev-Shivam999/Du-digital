import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  build: {
    // Increase chunk size warning limit to 2000 kB
    chunkSizeWarningLimit: 2000,
    // Enable source map for debugging (set to false for even smaller output)
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom'],
          // Routing
          'vendor-router': ['react-router-dom'],
          // State management
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // Icons (often large)
          'vendor-icons': ['lucide-react'],
          // React Icons
          'vendor-react-icons': ['react-icons'],
          // Swiper
          'vendor-swiper': ['swiper'],
          // Motion / animation
          'vendor-motion': ['motion'],
          // Markdown preview (for blogs)
          'vendor-markdown': ['@uiw/react-markdown-preview'],
        },
      },
    },
  },
  // SSR configuration – used when building entry-server.jsx
  ssr: {
    // Do NOT externalize react-dom/server — we need it bundled in the SSR build
    noExternal: ['react-dom'],
  },
})
