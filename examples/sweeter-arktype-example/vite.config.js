import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import sweeterPlugin, { watchDependenciesPlugin } from '@captainpants/rollup-plugin-sweeter';

export default defineConfig({
    build: {
        outDir: 'dist',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext"
    },
    plugins: [circularDependency({ circleImportThrowErr: true }), sweeterPlugin({ projectName: '@captainpants/sweeter-arktype-example', roots: [__dirname] }),
    watchDependenciesPlugin({ dependencies: [{ namePattern: '@captainpants/*', filesPattern: 'dist/**/*' }] })],
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ]
    },
    optimizeDeps: {
        exclude: [
            '@captainpants/sweeter-core',
            '@captainpants/sweeter-web',
            '@captainpants/sweeter-web-gummybear'
        ]
    }
});