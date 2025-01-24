import { resolve } from 'path';
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import dts from 'vite-plugin-dts';

const exclude = [
    /ModelFactory\.ts$/ // ModelFactory circularly depends on ObjectImpl and ArrayModelImpl - safely inside method calls.
];

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: [
                resolve(__dirname, './src/index.ts'),
                resolve(__dirname, './src/extendArkTypes.ts')
            ],
            fileName: '[name]',
            name: '[name]',
            formats: ['es'],
        },
        outDir: 'dist',
        minify: false,
        rollupOptions: {
        },
        target: "ESNext",
    },
    test: {
        poolOptions: {
            forks: {
                execArgv: ["--expose-gc"]
            }
        },
    },
    plugins: [dts({ clearPureImport: false }), nodeExternals(), circularDependency({ circleImportThrowErr: true, exclude: exclude })]
});
