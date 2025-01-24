import { resolve } from 'path';
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import dts from 'vite-plugin-dts';
import ptolemyPlugin, { watchDependenciesPlugin } from '@serpentis/rollup-plugin-ptolemy';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, './src/index.ts'),
            fileName: 'index',
            formats: ['es'],
        },
        outDir: 'dist',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext",
    },
    plugins: [dts(), nodeExternals(), circularDependency({ circleImportThrowErr: true }), ptolemyPlugin({ projectName: '@serpentis/ptolemy-web-stardust', roots: [__dirname] }),
    watchDependenciesPlugin({ dependencies: [{ namePattern: '@serpentis/*', filesPattern: 'dist/build-complete.notice' }], buildCompleteNoticePath: 'dist/build-complete.notice' })],
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ],
        poolOptions: {
            forks: {
                execArgv: ["--expose-gc"]
            }
        },
    },
    optimizeDeps: {
        exclude: [
            '@serpentis/ptolemy-core',
            '@serpentis/ptolemy-web'
        ]
    }
});