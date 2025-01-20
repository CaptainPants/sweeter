import { FSWatcher, FSWatcherEventMap, watch } from 'chokidar';
import { Plugin as RollupPlugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import path from 'path';
import debounce from 'debounce';
import fs from 'node:fs';

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

    const dummy = path.resolve(
        process.cwd(),
        `alsoWatch_${Date.now()}.txt`
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

            log(`Watching ${(include.map(include => path.posix.join(watchRoot.replace(/\\|\//g, '/'), 'xxxx', include)).join(', '))}`);

            this.addWatchFile(dummy);

            watcher = watch(watchRoot.replace(/\//g, path.sep), {
                //awaitWriteFinish: true,
                followSymlinks: true,
                ignoreInitial: true,
                alwaysStat: true,
                usePolling: true // reliability issue
            });

            const listener: (...args: FSWatcherEventMap['all']) => void = (eventName, modifiedFilePath, stats) => {
                // Seems to not be the full path
                modifiedFilePath = path.resolve(modifiedFilePath);

                // filter expects an absolute path
                const matched = filter(modifiedFilePath);

                // const specificTargetExample = 'C:\\workspace\\sweeter\\examples\\rollup-sweeter-plugin-usage\\node_modules\\@captainpants\\rollup-plugin-sweeter\\dist\\index.js';

                if (matched) {
                    log(`Change detected on file ${modifiedFilePath}, writing to dummy ${dummy}`);
                    fs.writeFileSync(dummy, `${Date.now()}`);
                    return;
                }
            }
            const debouncedFileListener = debounce(listener, 500);

            watcher.addListener('all', debouncedFileListener);
        },
        async closeWatcher(): Promise<void> {
            if (watcher) {
                await watcher.close();
                watcher = undefined;
            }

            if (fs.statSync(dummy, { throwIfNoEntry: false })) {
                fs.unlinkSync(dummy);
            }
        },
        watchChange(id) {
            this.info(
                `File ${id} changed.`,
            );
        },
    };
}

// dfgsadgad