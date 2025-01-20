import { FSWatcher, watch } from 'chokidar';
import { glob } from 'glob';
import fs from 'node:fs/promises';
import { Plugin as RollupPlugin } from 'rollup';

export interface AlsoWatchPluginOptions {
    watchRoot: string,
    globs: string[];
    debug?: boolean;
}

export function alsoWatchPlugin(options: AlsoWatchPluginOptions): RollupPlugin;
export function alsoWatchPlugin({
    watchRoot,
    globs,
    debug,
}: AlsoWatchPluginOptions): RollupPlugin {
    // Common state here
    let watcher: FSWatcher | undefined;

    return {
        name: 'rollup-plugin-sweeter/alsoWatchPlugin',
        // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
        async buildStart() {

            if (!this.meta.watchMode) {
                return;
            }
            
            watcher = watch(watchRoot, {
                cwd: watchRoot,
                awaitWriteFinish: true,
                followSymlinks: true
            });
            watcher.addListener('all', () => {
                // emit a dummy file / update
            })

            const log: (message: string) => void = debug
                ? (message) => this.info(message)
                : () => {};
                
            if (process.argv.includes('--watch')) {
                if (debug) {
                    log(`Adding files to watch based on globs:`);
                    for (const current of globs) {
                        log(`- ${current}`);
                    }
                }

                for await (const file of glob.globIterate(globs, {
                    nodir: true,
                })) {
                    // Example id:
                    //   C:/workspace/sweeter/packages/sweeter-core/src/signals/internal/Signal-implementations/DerivedSignal.ts
                    //   C:/workspace/sweeter/packages/sweeter-core/node_modules/@captainpants/rollup-plugin-sweeter/build/index.js
                    const resolved = (await fs.realpath(file)).replace(
                        /\\/g,
                        '/',
                    );

                    log(`+ Watching ${resolved}`);
                    // According to the rollup docs, you can use a relative path https://rollupjs.org/plugin-development/#this-addwatchfile
                    this.addWatchFile(resolved);
                }
            }
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
