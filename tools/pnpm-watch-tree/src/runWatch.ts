import chalk, { type ChalkInstance } from "chalk";

import { type Project } from "./types.ts";
import { runOne } from "./runOne.ts";
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

    const cleanups: (() => void)[] = [];
    try {
        async function start(project: Project) {
            const loan = chalks.loan();

            try {
                const prefix = `[${project.name}] `;

                const log = (data: string) => {
                    console.log(loan.chalk(prefix) + data);
                }

                const handle = await runOne({
                    project,
                    target,
                    successPatternRegExp,
                    log,
                    signal
                });

                cleanups.push(handle.cleanup);

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

        await new Promise(
            resolve => {
                signal.addEventListener(
                    'abort', 
                    () => {
                        console.warn(chalk.yellowBright('ABORTING'));
                        void resolve(void 0)
                    }
                );
            }
        )
    }
    finally {
        console.warn(chalk.yellowBright('TERMINATING CHILD PROCESSES'));

        for (const cleanup of cleanups) {
            try {
                cleanup();
            }
            catch (ex) {
                console.error('Error caught while cleaning up', ex);
            }
        }
    }
}
