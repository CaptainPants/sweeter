import { FSWatcher, FSWatcherEventMap, watch } from 'chokidar';
import { Plugin as RollupPlugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import path from 'path';

export interface AlsoWatchPluginOptions {
    watchRoot: string;
    include: string[];
    exclude?: string[];
    debug?: boolean;
}

export function alsoWatchPlugin(options: AlsoWatchPluginOptions): RollupPlugin;
export function alsoWatchPlugin({
    watchRoot,
    include,
    exclude,
    debug,
}: AlsoWatchPluginOptions): RollupPlugin {
    // We accept a path with '/'s in it regardless of platform, and normalize them all to the platform seperator
    watchRoot = path.resolve(
        process.cwd().replace(/\\|\//g, path.sep), 
        watchRoot.replace(/\\|\//g, path.sep)
    );

    const filter = createFilter(include, exclude, { resolve: watchRoot });

    // Common state here
    let watcher: FSWatcher | undefined;

    return {
        name: 'rollup-plugin-sweeter/alsoWatchPlugin',
        // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
        buildStart() {
            const log: (message: string) => void = debug
                ? (message) => this.info(message)
                : () => {};

            if (!this.meta.watchMode) {
                log('Not in watch mode..');
                return;
            }

            log(`Watching ${(include.map(x => path.posix.join(watchRoot, x)).join(', '))}`)

            watcher = watch(watchRoot.replace(/\//g, path.sep), {
                //awaitWriteFinish: true,
                followSymlinks: true,
                ignoreInitial: true,
                alwaysStat: true,
            });

            const listener: (...args: FSWatcherEventMap['all']) => void = (eventName, modifiedFilePath, stats) => {
                // Seems to not be the full path
                modifiedFilePath = path.resolve(modifiedFilePath);

                // filter expects an absolute path
                const matched = filter(modifiedFilePath);

                // const specificTargetExample = 'C:\\workspace\\sweeter\\examples\\rollup-sweeter-plugin-usage\\node_modules\\@captainpants\\rollup-plugin-sweeter\\dist\\index.js';

                if (matched) {
                    log(`Change detected on file ${modifiedFilePath}`);
                    // emit a dummy file / update, ideally debounced
                    return;
                }
            }

            watcher.addListener('all', listener);
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

export function BANANA2345_123() {}