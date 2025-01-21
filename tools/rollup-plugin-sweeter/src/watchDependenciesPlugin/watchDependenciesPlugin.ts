import { watch } from 'chokidar';
import { Dirent } from 'node:fs';
import fs, { access } from 'node:fs/promises';
import path from 'node:path';
import picomatch from 'picomatch';
import { Plugin as RollupPlugin } from 'rollup';

export interface WatchDependenciesPluginOptions {
    dependencies: (RegExp | string)[];
    debug?: boolean;
}

export function watchDependenciesPlugin(options: WatchDependenciesPluginOptions): RollupPlugin;
export function watchDependenciesPlugin({
    dependencies,
    debug,
}: WatchDependenciesPluginOptions): RollupPlugin {

    const cleanup: (() => Promise<void>)[] = [];

    return {
        name: 'rollup-plugin-sweeter/watchDependenciesPlugin',
        // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
        async buildStart() {
            const log: (message: string) => void = debug //debug
                ? (message) => this.info(message)
                : () => {};

            if (!this.meta.watchMode) {
                log('Not in watch mode..');
                return;
            }

            const allDependencies = await gatherDependencies(process.cwd());

            const matchers = dependencies.map(x => {
                if (x instanceof RegExp) {
                    return x;
                }
                else {
                    const parsed = picomatch(x);
                    return {
                        test: parsed
                    }
                }
            });

            function filter(a: string): boolean {
                return matchers.some(x => x.test(a));
            }

            log(`Considering: ${JSON.stringify(allDependencies)}`);

            const filteredDependencies = allDependencies.filter(x => filter(x.name));

            log('Watch mode started.');

            log(`Watching dependencies: ${filteredDependencies.map(dep => dep.name).join(', ')}`);
            
            const paths = filteredDependencies.map(x => x.realPath);

            const watcher = watch(paths, {
                awaitWriteFinish: true,
                followSymlinks: true,
                ignoreInitial: true,
            });

            watcher.addListener('all', (eventName, path) => {
                // emit a dummy file / update
                log(`FS event ${eventName} at ${path}`);
                
                //log(`Matched: ${matched}`);
            });
        },
        async closeWatcher(): Promise<void> {
            for (const item of cleanup) {
                await item();
            }
            cleanup.length = 0;
        },
        watchChange(id) {
            this.info(
                `File ${id} changed (note that this includes files that are being watched directly/outside the alsoWatchPlugin).`,
            );
        },
    };
}

function normalizePath(path: string, to: '/' | '\\'): string {
    return path.replace(/\\|\//g, to);
}

async function exists(path: string): Promise<boolean> {
    try {
        await access(path, fs.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}

export async function gatherDependencies(projectRoot: string): Promise<{ name: string, realPath: string }[]> {
    projectRoot = normalizePath(projectRoot, path.sep);
    const node_modules = path.resolve(projectRoot, 'node_modules');

    console.warn('Starting at ' + node_modules)

    const res: { name: string, realPath: string }[] = [];

    const topLevelEntries = await fs.readdir(node_modules, { withFileTypes: true });

    for (const item of topLevelEntries) {
        const itemLocation = await getRealLocationForDirectory(item);

        if (itemLocation === null) {
            continue;
        }

        if (item.name.startsWith('@')) {
            // scoped
            const scopedDir = path.resolve(node_modules, item.name);

            for (const scopedItem of await fs.readdir(scopedDir, { withFileTypes: true })) {
                const scopedItemLocation = await getRealLocationForDirectory(scopedItem);

                if (scopedItemLocation === null) {
                    continue;
                }

                const scopedCandidatePackageJson = path.resolve(scopedItemLocation, 'package.json');
                if (await exists(scopedCandidatePackageJson)) {
                    res.push({ name: item.name + '/' + scopedItem.name, realPath: scopedItemLocation });
                }
            }

            continue;
        }

        // Non-scoped, could be a package
        const candidatePackageJson = path.resolve(itemLocation, 'package.json');
        if (await exists(candidatePackageJson)) {
            res.push({ name: item.name, realPath: itemLocation });
        }
    }

    return res;
}

async function getRealLocationForDirectory(item: Dirent): Promise<string | null> {
    if (item.isDirectory()) {
        const resolved = path.resolve(item.parentPath, item.name);
        return resolved;
    }
    else if (item.isSymbolicLink()) {
        const resolved = path.resolve(item.parentPath, item.name);
        const realpath = await fs.realpath(resolved);
        if ((await fs.stat(realpath)).isDirectory()) {
            return realpath;
        }
    }
    return null;
}