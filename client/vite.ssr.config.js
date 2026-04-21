/**
 * vite.ssr.config.js
 * Used only when building the server-side bundle:
 *   vite build --config vite.ssr.config.js
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    resolve: {
        dedupe: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
    },
    build: {
        ssr: true,                          // tell Vite this is an SSR build
        outDir: 'dist/server',
        rollupOptions: {
            input: 'src/entry-server.jsx',
            // No manualChunks for SSR – everything is bundled into one file
        },
        minify: false,                      // SSR doesn't need minification
        sourcemap: false,
    },
    ssr: {
        // Bundle everything to ensure a single version of React/Redux is used.
        noExternal: true,
        // Ensure Node built-ins stay external.
        external: ['path', 'fs', 'url', 'stream', 'util', 'crypto', 'async_hooks', 'process']
    },
});
