import chalk from 'chalk';

import { createChalkLibrary } from './createChalkLibrary.ts';
import { type WatchConfigFileJson } from './loadWatchJson.ts';
import { runOne, type RunOneCleanupHandle } from './runOne.ts';
import { type Project } from './types.ts';

export interface WatchOptions {
    projects: Project[];
    target: string;
    group?: string | undefined | null;
    signal: AbortSignal;
    configFile: WatchConfigFileJson;
}

export async function runWatch({
    projects,
    target,
    group,
    signal,
    configFile,
}: WatchOptions): Promise<void> {
    function topLevelLog(data: string) {
        console.log(chalk.green(data));
    }

    topLevelLog('Starting watch...');
    if (group) {
        topLevelLog(`Using group: ${group}`);
    }

    const roots = projects.filter((x) => x.workspaceDependencies.length == 0);
    if (roots.length < 1) {
        throw new Error(
            'No roots found, this could indicate a circular dependency.',
        );
    }

    const groupConfig = group ? (configFile.groups?.[group] ?? null) : null;
    const projectsToProcess = groupConfig?.projects
        ? new Set(groupConfig?.projects)
        : null;

    if (projectsToProcess) {
        projects = projects.filter((x) => projectsToProcess.has(x.name));
    }

    const incomplete = new Set<string>(projects.map((x) => x.name));
    const completed = new Set<string>();

    const notStarted = new Map(projects.map((proj) => [proj.name, proj])); // copy
    const currentlyProcessing = new Map<string, Promise<Project>>();
    const processed: Project[] = [];

    const chalks = createChalkLibrary();

    const cleanups: RunOneCleanupHandle[] = [];
    try {
        async function start(project: Project) {
            const loan = chalks.loan();

            try {
                const prefix = `[${project.name}] `;

                const log = (data: string) => {
                    console.log(loan.chalk.prefix(prefix) + data);
                };
                const passthrough = (data: string) => {
                    console.log(loan.chalk.prefix(prefix) + '>> ' + data);
                };
                const header = (data: string) => {
                    console.log(
                        loan.chalk.prefix(prefix) +
                            loan.chalk.header('== ' + data + ' =='),
                    );
                };

                const projectConfig = configFile.projects?.[project.name];
                const successPattern = projectConfig?.successPattern;

                const successPatternRegExp: RegExp | null = successPattern
                    ? new RegExp(successPattern)
                    : null;

                const handle = await runOne({
                    project,
                    target,
                    successPatternRegExp,
                    log,
                    header,
                    passthrough,
                    signal,
                });

                cleanups.push(handle);

                return project;
            } finally {
                loan.return();
            }
        }

        function outputProgress() {
            topLevelLog(
                `Processed ${completed.size}/${projects.length} projects`,
            );
        }

        for (const root of roots) {
            currentlyProcessing.set(root.name, start(root));
            notStarted.delete(root.name);
        }

        outputProgress();

        while (currentlyProcessing.size > 0) {
            // Wait for any to complete
            const finished = await Promise.any(currentlyProcessing.values());
            signal.throwIfAborted();

            incomplete.delete(finished.name);
            completed.add(finished.name);

            processed.push(finished);
            currentlyProcessing.delete(finished.name);

            for (const [name, node] of notStarted) {
                // Some dependencies may not be included in the group we are building
                // so we only check to make sure that any we are waiting on are still
                // in the incomplete set
                if (
                    !node.workspaceDependencies.some((x) => incomplete.has(x))
                ) {
                    currentlyProcessing.set(name, start(node));
                    notStarted.delete(name);
                }
            }

            outputProgress();
        }

        if (notStarted.size > 0) {
            // Something didn't get processed
        }

        topLevelLog('All watchers have been started.');

        // Wait for the abort signal
        await new Promise((resolve) => {
            signal.addEventListener('abort', () => {
                void resolve(void 0);
            });
        });
    } finally {
        console.log(chalk.yellowBright('Terminating all child processes'));

        for (const current of cleanups) {
            try {
                await current.cleanup();
            } catch (ex) {
                console.error('Error caught while cleaning up', ex);
            }
        }

        console.log(
            chalk.yellowBright('All child processes have been terminated'),
        );
    }
}
