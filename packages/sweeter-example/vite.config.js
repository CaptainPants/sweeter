import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'build',
        minify: false,
        rollupOptions: {
        }
    },
    test: {
      environmentMatchGlobs: [
        ['**', 'jsdom'],
      ]
    }
});