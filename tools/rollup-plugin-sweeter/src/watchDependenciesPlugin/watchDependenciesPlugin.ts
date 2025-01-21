import { FSWatcherEventMap, watch } from 'chokidar';
import debounce from 'debounce';
import { Dirent } from 'node:fs';
import fs from 'node:fs';
import fsPromises, { access } from 'node:fs/promises';
import path, { resolve } from 'node:path';
import picomatch from 'picomatch';
import { Plugin as RollupPlugin } from 'rollup';

// TODO: we can Arktype this
export interface WatchDependendeny {
    name: string | RegExp;
    fileMatches?: string | RegExp;
}

export interface WatchDependenciesPluginOptions {
    dependencies: WatchDependendeny[];
    debug?: boolean;
}

const matchNodeModules = picomatch('node_modules/**/*');

export function watchDependenciesPlugin(options: WatchDependenciesPluginOptions): RollupPlugin;
export function watchDependenciesPlugin({
    dependencies: dependencyRules,
    debug,
}: WatchDependenciesPluginOptions): RollupPlugin {

    const cleanup: (() => Promise<void>)[] = [];

    const dummyPath = resolve(process.cwd(), `watchDependency.dummy.txt`);

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

            const preparedRules = dependencyRules.map(
                rule => {
                    return {
                        rule, 
                        packageNameMatches: createMatcher(rule.name),
                        fileMatches: createMatcher(rule.fileMatches)
                    }
                }
            );

            const matched = allDependencies.map(dep => ({ dep, rule: preparedRules.find(x => x.packageNameMatches(dep.name)) }))

            const whereMatched = matched.filter(x => x.rule);

            log(`Considering: ${JSON.stringify(allDependencies)}`);

            log('Watch mode started.');

            log(`Watching dependencies: ${whereMatched.map(item => item.dep.name).join(', ')}`);
            
            for (const current of whereMatched) {
                const watcher = watch(current.dep.realPath, {
                    awaitWriteFinish: true,
                    followSymlinks: true,
                    ignoreInitial: true,
                });
    
                const listener: (...args: FSWatcherEventMap['all']) => void = (eventName, eventPath) => {
                    const relativePath = path.relative(current.dep.realPath, eventPath);
                    const normalized = normalizePath(relativePath, '/');

                    // Ignore anything in the node_modules folder
                    if (matchNodeModules(normalized)) {
                        return;
                    }

                    // emit a dummy file / update
                    log(`FS event ${eventName} at ${relativePath}`);
    
                    fs.writeFileSync(dummyPath, `${Date.now()}`);
                };
                const debounced = debounce(listener, 1000);
    
                watcher.addListener('all', debounced);
    
                cleanup.push(() => watcher.close());
            }

        },
        async closeWatcher(): Promise<void> {
            for (const callback of cleanup) {
                await callback();
            }
            cleanup.length = 0;

            if (await exists(dummyPath)) {
                await fsPromises.unlink(dummyPath);
            }
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

function createMatcher(pattern: string | RegExp | undefined): (str: string) => boolean {
    if (pattern instanceof RegExp) {
        return str => pattern.test(str);
    }
    else if (typeof pattern === 'string') {
        const parsed = picomatch(pattern);
        return parsed;
    }
    else {
        return () => true;
    }
}

async function exists(path: string): Promise<boolean> {
    try {
        await access(path, fsPromises.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}

export async function gatherDependencies(projectRoot: string): Promise<{ name: string, realPath: string }[]> {
    projectRoot = normalizePath(projectRoot, path.sep);
    const nodeModulesPath = path.resolve(projectRoot, 'node_modules');

    console.warn('Starting at ' + nodeModulesPath)

    const dependencies: { name: string, realPath: string }[] = [];

    const topLevelEntries = await fsPromises.readdir(nodeModulesPath, { withFileTypes: true });

    for (const item of topLevelEntries) {
        const itemLocation = await getRealLocationForDirectory(item);

        if (itemLocation === null) {
            continue;
        }

        if (item.name.startsWith('@')) {
            // scoped
            const scopedDir = path.resolve(nodeModulesPath, item.name);

            for (const scopedItem of await fsPromises.readdir(scopedDir, { withFileTypes: true })) {
                const scopedItemLocation = await getRealLocationForDirectory(scopedItem);

                if (scopedItemLocation === null) {
                    continue;
                }

                const scopedCandidatePackageJson = path.resolve(scopedItemLocation, 'package.json');
                if (await exists(scopedCandidatePackageJson)) {
                    dependencies.push({ name: item.name + '/' + scopedItem.name, realPath: scopedItemLocation });
                }
            }

            continue;
        }

        // Non-scoped, could be a package
        const candidatePackageJson = path.resolve(itemLocation, 'package.json');
        if (await exists(candidatePackageJson)) {
            dependencies.push({ name: item.name, realPath: itemLocation });
        }
    }

    return dependencies;
}

async function getRealLocationForDirectory(item: Dirent): Promise<string | null> {
    if (item.isDirectory()) {
        const resolved = path.resolve(item.parentPath, item.name);
        return resolved;
    }
    else if (item.isSymbolicLink()) {
        const resolved = path.resolve(item.parentPath, item.name);
        const realpath = await fsPromises.realpath(resolved);
        if ((await fsPromises.stat(realpath)).isDirectory()) {
            return realpath;
        }
    }
    return null;
}