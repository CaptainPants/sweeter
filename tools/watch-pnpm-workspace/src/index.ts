import chalk from 'chalk';
import { program } from 'commander';
import { setMaxListeners } from 'node:events';

import { filterProjects } from './filterProjects.ts';
import { findWorkspaceRoot } from './findWorkspaceRoot.ts';
import { loadProjects } from './loadProjects.ts';
import { loadWatchJson } from './loadWatchJson.ts';
import { runWatch } from './runWatch.ts';

interface Options {
    group?: string;
}

const abortController = new AbortController();

// This is driven by however many processes we may have open
setMaxListeners(100, abortController.signal);

process.on('SIGINT', function () {
    abortController.abort('SIGINT');
});

program.version('1.0.0').description('watch-tree');

program
    .command('run <target>')
    .option<string | null>(
        '--group <group>',
        'The group to build',
        (value) => value,
    )
    .action(async (target: string, { group }: Options) => {
        const cwd = process.cwd();

        const workspaceRoot = await findWorkspaceRoot(cwd);
        const projects = await loadProjects(workspaceRoot);
        const configFile = await loadWatchJson(workspaceRoot);

        const filtered = filterProjects(projects, target);

        await runWatch({
            projects: filtered,
            target: target,
            group: group,
            signal: abortController.signal,
            configFile: configFile,
        });

        console.log(chalk.green('Finished'));
    });

await program.parseAsync();
