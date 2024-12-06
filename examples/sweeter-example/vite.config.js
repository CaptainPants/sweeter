import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';

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