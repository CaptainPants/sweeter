import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'build',
        minify: false,
        rollupOptions: {
        },
        watch: {
            include: []
        }
    },
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ]
    },
    optimizeDeps: {
        exclude: [
            '@captainpants/sweeter-core',
            '@captainpants/sweeter-web',
            '@captainpants/sweeter-gummybear'
        ]
    }
});