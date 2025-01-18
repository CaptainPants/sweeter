import { resolve } from 'path';
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import dts from 'vite-plugin-dts';
import sweeterPlugin, { alsoWatchPlugin } from '@captainpants/rollup-plugin-sweeter';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: [resolve(__dirname, './src/index.ts')],
            formats: ['es'],
        },
        outDir: 'dist',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext"
    },
    plugins: [dts({ clearPureImport: false }), nodeExternals(), circularDependency({ circleImportThrowErr: true }), sweeterPlugin({ projectName: '@captainpants/sweeter-rollup-plugin-usage', roots: [__dirname] }),
    alsoWatchPlugin({ globs: ['node_modules/@captainpants/*/dist/**/*'] })],
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
        exclude: ['@captainpants/sweeter-core']
    }
});