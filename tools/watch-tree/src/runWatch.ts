import chalk, { type ChalkInstance } from "chalk";
import { stdout } from "node:process";

import  { type Project } from "./types.ts";
import ora from "ora";
import child_process from 'node:child_process';
import { createPassthrough } from "./createPassthrough.ts";

export interface WatchOptions {
    projects: Project[];
    target: string;
    successPattern?: string;
    signal: AbortSignal;
}

export async function runWatch({ projects, target, successPattern, signal }: WatchOptions) {
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

    console.log(chalk.green('Using roots ' + roots.map(x => x.name).join(', ')));

    const chalks: Set<ChalkInstance> = new Set([
        chalk.blue,
        chalk.cyan,
        chalk.magenta,
        chalk.yellow,
        //chalk.white
    ]);

    function start(project: Project) {
        const rent = (chalks.size !== 0);

        let useChalk: ChalkInstance;
        if (rent) {
            const temp = first(chalks);
            if (temp === undefined) throw new Error('Unexpected');
            chalks.delete(temp);
            useChalk = temp;
        } else {
            useChalk = chalk.grey;
        }
        
        try {
            const prefix = `[${project.name}] `;

            const log = (data: string) => {
                console.log(chalk.red(prefix) + data);
            }
            return runOne(project, target, successPatternRegExp, log, signal).then(() => project);
        }
        finally {
            if (rent) {
                chalks.add(useChalk);
            }
        }
    }

    for (const root of roots) {
        currentlyProcessing.set(root.name, start(root));
        notProcessed.delete(root.name);
    }
    
    while (currentlyProcessing.size > 0) {
        // Wait for any to complete
        const finished = await Promise.any(currentlyProcessing.values());
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

    console.log(chalk.green('FINISHED'));

    return;
}

function first<T>(iterable: Iterable<T>): T | undefined {
    for (const item of iterable) {
        return item;
    }
    return undefined;
}