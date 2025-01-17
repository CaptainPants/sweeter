import { findWorkspacePackages } from '@pnpm/find-workspace-packages';

import { type Project } from './types.ts';
import { findWorkspaceRoot } from './findWorkspaceRoot.ts';

export async function loadProjects(workspaceRoot: string): Promise<Project[]> {
    const root = await findWorkspaceRoot(workspaceRoot);

    const projects = await findWorkspacePackages(root);

    const rootIsADependency = projects.some((x) =>
        Object.keys(x.manifest.dependencies ?? {})
            .concat(Object.keys(x.manifest.devDependencies ?? {}))
            .includes('root'),
    );

    const res: Project[] = [];

    for (const project of projects) {
        if (project.manifest.name === 'root' && !rootIsADependency) {
            continue; // skip the root project if its not a dependency
        }

        const mergedDependencies = {
            ...project.manifest.dependencies,
            ...project.manifest.devDependencies,
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
            scripts: project.manifest.scripts
                ? Object.keys(project.manifest.scripts)
                : [],
        };

        res.push(node);
    }

    return res;
}
