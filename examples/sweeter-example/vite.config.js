import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'build',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext"
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