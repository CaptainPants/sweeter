import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import ptolemyPlugin, { watchDependenciesPlugin } from '@serpentis/rollup-plugin-ptolemy';

export default defineConfig({
    build: {
        outDir: 'dist',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext"
    },
    plugins: [circularDependency({ circleImportThrowErr: true }), ptolemyPlugin({ projectName: '@serpentis/ptolemy-arktype-example', roots: [__dirname] }),
    watchDependenciesPlugin({ dependencies: [{ namePattern: '@serpentis/*', filesPattern: 'dist/build-complete.notice' }], buildCompleteNoticePath: 'dist/build-complete.notice' })],
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ]
    },
    optimizeDeps: {
        exclude: [
            '@serpentis/ptolemy-core',
            '@serpentis/ptolemy-web',
            '@serpentis/ptolemy-web-stardust'
        ]
    }
});