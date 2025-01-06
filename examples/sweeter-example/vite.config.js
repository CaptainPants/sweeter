import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import sweeterPlugin from '@captainpants/rollup-plugin-sweeter';

export default defineConfig({
    build: {
        outDir: 'build',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext"
    },
    plugins: [circularDependency({ circleImportThrowErr: true }), sweeterPlugin({ projectName: '@captainpants/sweeter-example', roots: [__dirname] })],
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ]
    },
    optimizeDeps: {
        exclude: [
            '@captainpants/sweeter-core',
            '@captainpants/sweeter-web',
            '@captainpants/sweeter-web-gummybear',
            '@captainpants/sweeter-arktype-modeling'
        ]
    }
});