import sweeterPlugin, { watchDependenciesPlugin } from '@captainpants/rollup-plugin-sweeter';
import { resolve } from 'path';
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import circularDependency from 'vite-plugin-circular-dependency';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, './src/index.ts'),
            fileName: 'index',
            name: 'index',
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
    plugins: [
        dts({ clearPureImport: false }), 
        nodeExternals(), 
        circularDependency({ circleImportThrowErr: true }), 
        sweeterPlugin({ projectName: '@captainpants/sweeter-core', roots: [__dirname] }),
        watchDependenciesPlugin({ dependencies: [{ namePattern: '@captainpants/*', filesPattern: 'dist/built.txt', buildCompleteNoticePath: 'dist/built.txt' }] })
    ]
});
