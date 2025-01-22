import { ArkErrors, type } from 'arktype';
import { FSWatcherEventMap, watch } from 'chokidar';
import debounce from 'debounce';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { debuglog } from 'node:util';
import picomatch from 'picomatch';
import { Plugin as RollupPlugin } from 'rollup';

import { fileExists } from '../utility/implementation/fileExists.js';
import { normalizePath } from '../utility/implementation/normalizePath.js';

import { gatherDependencies } from './gatherDependencies.js';

const watchDependencySchema = type({
    'namePattern?': 'string | RegExp',
    'filesPattern?': 'string | RegExp'
});
const watchDependencyPluginOptionsSchema = type({
    'dependencies': watchDependencySchema.array(),
    'debounceTimeout?': 'number',
    'buildCompleteNoticePath?': 'string',
    'debug?': 'boolean'
});

export type WatchDependenciesPluginOptions = type.infer<typeof watchDependencyPluginOptionsSchema>;

const matchNodeModules = picomatch('node_modules/**/*');

export function watchDependenciesPlugin(options: WatchDependenciesPluginOptions): RollupPlugin {
    const parsed = watchDependencyPluginOptionsSchema(options);
    if (parsed instanceof ArkErrors) {
        throw new Error(`Error parsing options: ${parsed.message}`);
    }

    const {
        dependencies: dependencyRules,
        debounceTimeout = 2000,
        buildCompleteNoticePath,
        debug,
    } = options;

    const cleanup: (() => Promise<void>)[] = [];

    const dummyPath = resolve(process.cwd(), `watch-trigger-dummy-file.notice`);

    return {
        name: 'rollup-plugin-sweeter/watchDependenciesPlugin',
        // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
        async buildStart() {
            const debugLog: (message: string) => void = debug
                ? (message) => this.info('[DBG] ' + message)
                : () => {};

            if (!this.meta.watchMode) {
                debugLog('Not in watch mode, no action.');
                return;
            }

            const allDependencies = await gatherDependencies(process.cwd());

            const preparedRules = dependencyRules.map((rule) => {
                return {
                    rule,
                    packageNameMatches: createMatcher(rule.namePattern),
                    fileMatches: createMatcher(rule.filesPattern),
                };
            });

            const matched = allDependencies.map((dep) => ({
                dep,
                rule: preparedRules.find((x) => x.packageNameMatches(dep.name)),
            }));

            const whereMatched = matched.filter((x) => x.rule);

            debugLog(
                `All dependencies found: ${allDependencies.map((x) => x.name).join(', ')}`,
            );
            this.info(
                `Watching dependencies: ${whereMatched.map((item) => item.dep.name).join(', ')}`,
            );

            this.addWatchFile(dummyPath);

            for (const current of whereMatched) {
                const watcher = watch(current.dep.realPath, {
                    awaitWriteFinish: true,
                    followSymlinks: true,
                    ignoreInitial: true,
                });

                const processor = (filename: string) => {
                    this.info(
                        `Updating as a result of change to file ${filename}`,
                    );

                    fs.writeFileSync(dummyPath, `${Date.now()}`);
                };
                const debouncedProcessor = debounce(processor, debounceTimeout);

                // This does the filtering, before calling a debounced processing function
                const listener: (...args: FSWatcherEventMap['all']) => void = (
                    eventName,
                    eventPath,
                ) => {
                    const relativePath = path.relative(
                        current.dep.realPath,
                        eventPath,
                    );
                    const normalizedRelativePath = normalizePath(
                        relativePath,
                        '/',
                    );

                    if (!current.rule) throw new Error('Should never happen.');

                    // Ignore anything in the node_modules folder
                    if (matchNodeModules(normalizedRelativePath)) {
                        return;
                    }

                    if (!current.rule.fileMatches(normalizedRelativePath)) {
                        return;
                    }

                    // emit a dummy file / update
                    debuglog(
                        `File watch event ${eventName} at ${normalizedRelativePath}`,
                    );

                    debouncedProcessor(eventPath);
                };

                watcher.addListener('all', listener);

                cleanup.push(() => watcher.close());
            }
        },
        async closeWatcher(): Promise<void> {
            if (!this.meta.watchMode) {
                debuglog('Not in watch mode, no cleanup required.');
                return;
            }

            this.info('Cleaning up');

            while (cleanup.length > 0) {
                const current = cleanup.pop();
                if (!current) throw new Error('Unexpected'); // Should never happen

                try {
                    await current();
                } catch (err) {
                    this.error(`Error processing cleanup (${String(err)})`);
                }
            }

            if (await fileExists(dummyPath)) {
                await fsPromises.unlink(dummyPath);
            }
        },
        async closeBundle() {
            if (!this.meta.watchMode) {
                return;
            }

            if (buildCompleteNoticePath) {
                this.info(
                    `Bundle closed during watch, updating ${buildCompleteNoticePath}`,
                );
                await fsPromises.writeFile(
                    buildCompleteNoticePath,
                    `Generated by bundle close event in watchDependenciesPlugin at ${Date.now()}`,
                    { flush: true },
                );
            }
        },
    };
}

function createMatcher(
    pattern: string | RegExp | undefined,
): (str: string) => boolean {
    if (pattern instanceof RegExp) {
        return (str) => pattern.test(str);
    } else if (typeof pattern === 'string') {
        const parsed = picomatch(pattern);
        return parsed;
    } else {
        return () => true;
    }
}
