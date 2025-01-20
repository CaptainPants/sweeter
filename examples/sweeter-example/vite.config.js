import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import sweeterPlugin, { alsoWatchPlugin } from '@captainpants/rollup-plugin-sweeter';

export default defineConfig({
    build: {
        outDir: 'dist',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext"
    },
    plugins: [circularDependency({ circleImportThrowErr: true }), sweeterPlugin({ projectName: '@captainpants/sweeter-example', roots: [__dirname] }),
    alsoWatchPlugin({ watchRoot: 'node_modules/@captainpants', include: ['*/dist/**/*'], exclude: ['**/node_modules/**/*'] })],
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