import { resolve } from 'path';
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, './src/index.ts'),
            fileName: 'index',
            name: 'index',
            formats: ['es', 'cjs'],
        },
        outDir: 'build',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext",
    },
    plugins: [dts({ clearPureImport: false }), nodeExternals()]
});
