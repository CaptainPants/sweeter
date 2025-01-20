import { FSWatcher, watch } from 'chokidar';
import { Plugin as RollupPlugin } from 'rollup';
import micromatch from 'micromatch';
import path from 'node:path';
import { createFilter } from '@rollup/pluginutils';

export interface AlsoWatchPluginOptions {
    include: string[];
    exclude?: string[];
    debug?: boolean;
}

export function alsoWatchPlugin(options: AlsoWatchPluginOptions): RollupPlugin;
export function alsoWatchPlugin({
    include,
    exclude,
    debug,
}: AlsoWatchPluginOptions): RollupPlugin {
    const filter = createFilter(include, exclude);

    // Common state here
    let watcher: FSWatcher | undefined;

    return {
        name: 'rollup-plugin-sweeter/alsoWatchPlugin',
        // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
        buildStart() {
            const log: (message: string) => void = debug //debug
                ? (message) => this.info(message)
                : () => {};

            const watchRoot = process.cwd();

            if (!this.meta.watchMode) {
                log('Not in watch mode..');
                return;
            }

            log('Watch mode started.');
            
            watcher = watch(watchRoot, {
                awaitWriteFinish: true,
                followSymlinks: true,
                ignoreInitial: true,
            });
            log(`Watching ${watchRoot}.`);

            watcher.addListener('all', (eventName, modifiedFilePath, stats) => {
                const relativePath = path.relative(watchRoot, modifiedFilePath);

                // emit a dummy file / update
                log(`FS event ${eventName} at ${relativePath}`);
                
                const matched = filter(relativePath);
                log(`Matched: ${matched}`);
            });
        },
        async closeWatcher(): Promise<void> {
            if (watcher) {
                await watcher.close();
                watcher = undefined;
            }
        },
        watchChange(id) {
            this.info(
                `File ${id} changed (note that this includes files that are being watched directly/outside the alsoWatchPlugin).`,
            );
        },
    };
}
