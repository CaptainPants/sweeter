import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, './src/index.ts'),
            fileName: 'index',
            formats: ['es', 'cjs'],
        },
        outDir: 'build',
        minify: false,
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['@captainpants/sweeter-core', '@captainpants/sweeter-web', '@captainpants/sweeter-web/jsx-runtime', '@captainpants/sweeter-web/jsx-dev-runtime'],
        }
    },
    plugins: [dts()],
    test: {
        environmentMatchGlobs: [
            ['**', 'jsdom'],
        ]
    },
    optimizeDeps: {
        exclude: [
            '@captainpants/sweeter-core',
            '@captainpants/sweeter-web'
        ]
    }
});