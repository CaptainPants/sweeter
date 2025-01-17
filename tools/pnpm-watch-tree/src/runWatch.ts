import chalk from "chalk";

import { type Project } from "./types.ts";
import { runOne, type RunOneCleanupHandle } from "./runOne.ts";
import { createChalkLibrary } from "./createChalkLibrary.ts";

export interface WatchOptions {
    projects: Project[];
    target: string;
    successPattern?: string;
    signal: AbortSignal;
}

export async function runWatch({ projects, target, successPattern, signal }: WatchOptions): Promise<void> {
    console.log(chalk.green('Starting watch...'));

    const successPatternRegExp: RegExp | null = successPattern ? new RegExp(successPattern) : null;

    const roots = projects.filter(x => x.workspaceDependencies.length == 0);
    if (roots.length < 1) {
        throw new Error('No roots found, this could indicate a circular dependency.');
    }

    const alreadyFinished = new Set<string>;
    const notProcessed = new Map(projects.map(proj => [proj.name, proj])); // copy
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
                }
                const header = (data: string) => {
                    console.log(loan.chalk.prefix(prefix) + loan.chalk.header('== ' + data + ' =='));
                }

                const handle = await runOne({
                    project,
                    target,
                    successPatternRegExp,
                    log,
                    header,
                    signal
                });

                cleanups.push(handle);

                return project;
            }
            finally {
                loan.return();
            }
        }

        for (const root of roots) {
            currentlyProcessing.set(root.name, start(root));
            notProcessed.delete(root.name);
        }

        while (currentlyProcessing.size > 0) {
            // Wait for any to complete
            const finished = await Promise.any(currentlyProcessing.values());
            signal.throwIfAborted();
            
            alreadyFinished.add(finished.name);
            processed.push(finished);
            currentlyProcessing.delete(finished.name);

            for (const [name, node] of notProcessed) {
                if (node.workspaceDependencies.every(x => alreadyFinished.has(x))) {
                    currentlyProcessing.set(name, start(node));
                    notProcessed.delete(name);
                }
            }
        }

        if (notProcessed.size > 0) {
            // Something didn't get processed
        }

        console.log(chalk.green('==== All watchers have been started ===='));

        // Wait for the abort signal
        await new Promise(
            resolve => {
                signal.addEventListener(
                    'abort', 
                    () => {
                        void resolve(void 0)
                    }
                );
            }
        )
    }
    finally {
        console.log(chalk.yellowBright('Terminating all child processes'));

        for (const current of cleanups) {
            try {
                await current.cleanup();
            }
            catch (ex) {
                console.error('Error caught while cleaning up', ex);
            }
        }

        console.log(chalk.yellowBright('All child processes have been terminated'));
    }
}
