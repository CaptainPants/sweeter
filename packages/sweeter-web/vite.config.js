import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: [resolve(__dirname, './src/index.ts'), resolve(__dirname, './src/jsx-runtime.ts'), resolve(__dirname, './src/jsx-dev-runtime.ts')],
            formats: ['es', 'cjs'],
        },
        outDir: 'build',
        minify: false,
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [/@captainpants\/.+/],
        }
    },
    plugins: [dts({ clearPureImport: false })],
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ]
    },
    optimizeDeps: {
        exclude: ['@captainpants/sweeter-core']
    }
});