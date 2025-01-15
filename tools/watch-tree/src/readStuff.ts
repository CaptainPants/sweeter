
import path from 'node:path';
import PackageJson from '@npmcli/package-json';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import { stat } from 'node:fs/promises';
import fs, { Stats } from 'node:fs';

export interface GraphNode {
    name: string;
    version: string;
    private: boolean;
    location: string;
    dependencies: string[]
}

function checkFileExists(filepath: string): Promise<boolean> {
    return new Promise((resolve) => {
        fs.access(filepath, fs.constants.F_OK, error => {
            resolve(!error);
        });
    });
}

async function findWorkspaceRoot() {
    const filename = 'pnpm-workspace.yaml';

    const startFrom = process.cwd();

    let current = startFrom;
    while (current) {
        const candidate = path.join(current, filename);

        if (await checkFileExists(candidate)) {
            let stats: Stats;
            try {
                stats = await stat(candidate)
            } catch (err) {
                continue; // probably means it doesn't exist
            }

            if (stats.isFile()) {
                return path.dirname(candidate);
            }
        }

        current = path.dirname(current);
    }

    throw new Error('Could not find a pnpm workspace.yaml file');
}

export async function getDependencyGraph(): Promise<GraphNode[]> {
    const root = await findWorkspaceRoot();

    const projects = await findWorkspacePackages(root);

    const res: GraphNode[] = [];

    for (const project of projects) {
        // Note this seems to want the project folder, not the actual package.json file path
        const packageJson = await PackageJson.load(project.dir, { create: false });

        const mergedDependencies = {
            ...project.manifest.dependencies,
            ...project.manifest.devDependencies
        };
        const dependencies: string[] = [];
        for (const [key, version] of Object.entries(mergedDependencies)) {
            // This is the pnpm convention
            if (version?.startsWith('workspace:')) {
                dependencies.push(key);
            }
        }

        const node: GraphNode = {
            location: project.dir,
            name: project.manifest.name ?? '',
            version: project.manifest.version ?? '',
            private: project.manifest.private ?? false,
            dependencies
        }

        res.push(node);
    }

    return res;
}