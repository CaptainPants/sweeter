
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import fs from 'node:fs/promises';
import path from 'node:path';

import { type Project } from './types.ts';


async function checkFileExists(filepath: string): Promise<boolean> {
    try {
        await fs.access(filepath, fs.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}

async function findWorkspaceRoot() {
    const filename = 'pnpm-workspace.yaml';

    const startFrom = process.cwd();

    let current = startFrom;
    while (current) {
        const candidate = path.join(current, filename);

        if (await checkFileExists(candidate)) {
            const stats = await fs.stat(candidate);

            if (stats.isFile()) {
                return path.dirname(candidate);
            }
        }

        current = path.dirname(current);
    }

    throw new Error('Could not find a pnpm workspace.yaml file');
}

export async function loadProjects(): Promise<Project[]> {
    const root = await findWorkspaceRoot();

    const projects = await findWorkspacePackages(root);

    const rootIsADependency = projects.some(x => Object.keys(x.manifest.dependencies ?? {}).concat(Object.keys(x.manifest.devDependencies ?? {})).includes('root'));

    const res: Project[] = [];

    for (const project of projects) {
        if (project.manifest.name === 'root' && !rootIsADependency) {
            continue; // skip the root project if its not a dependency
        }

        const mergedDependencies = {
            ...project.manifest.dependencies,
            ...project.manifest.devDependencies
        };
        const workspaceDependencies: string[] = [];
        for (const [key, version] of Object.entries(mergedDependencies)) {
            // This is the pnpm convention
            if (version?.startsWith('workspace:')) {
                workspaceDependencies.push(key);
            }
        }

        const node: Project = {
            location: project.dir,
            name: project.manifest.name ?? '',
            version: project.manifest.version ?? '',
            private: project.manifest.private ?? false,
            workspaceDependencies: workspaceDependencies,
            scripts: project.manifest.scripts ? Object.keys(project.manifest.scripts) : []
        }

        res.push(node);
    }

    return res;
}