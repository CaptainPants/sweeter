import chalk from "chalk";
import { stdout } from "node:process";

import  { type Project } from "./types.ts";

export interface WatchOptions {
    projects: Project[];
    target: string;
    signal: AbortSignal;
}

export async function runWatch({ projects, target, signal }: WatchOptions) {
    stdout.write(chalk.green('Starting watch...\n'));

    const roots = projects.filter(x => x.workspaceDependencies.length == 0);
    if (roots.length < 1) {
        throw new Error('No roots found, this could indicate a circular dependency.');
    }

    const alreadyFinished = new Set<string>;
    const notProcessed = new Map(projects.map(proj => [proj.name, proj])); // copy
    const currentlyProcessing = new Map<string, Promise<Project>>();
    const processed: Project[] = [];

    stdout.write(chalk.green('Using roots ' + roots.map(x => x.name).join(', ')) + '\n');

    for (const root of roots) {
        currentlyProcessing.set(root.name, processOne(root));
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
                currentlyProcessing.set(name, processOne(node));
                notProcessed.delete(name);
            }
        }
    }

    if (notProcessed.size > 0) {
        // Something didn't get processed
    }

    return;
}

async function processOne(project: Project): Promise<Project> {
    console.log('Finished - ' + project.name);
    return project;
}