
import * as child_process from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import PackageJson from '@npmcli/package-json';

export interface Project {
    name: string;
    version: string;
    private: boolean;
    location: string;
}

export interface GraphNode {
    name: string;
    version: string;
    private: boolean;
    location: string;
    dependencies: string[]
}

export async function readProjectsFromLerna(): Promise<Project[]> {
    const result = await promisify(child_process.exec)('pnpm exec lerna list --json', { cwd: process.cwd() });
    return JSON.parse(result.stdout);
}

// This doesn't consider dev dependencies which is a pain in the neck
export async function donotuse_readDependenciesFromLerna(): Promise<{ [project: string]: string[] }> {
    const result = await promisify(child_process.exec)('pnpm exec lerna list --graph', { cwd: process.cwd() });
     return JSON.parse(result.stdout);
}

export async function getDependencyGraph(): Promise<GraphNode[]> {
    const projects = await readProjectsFromLerna();

    const res: GraphNode[] = [];

    for (const project of projects) {
        // Note this seems to want the project folder, not the actual package.json file path
        const packageJson = await PackageJson.load(project.location, { create: false });

        const mergedDependencies = {
            ...packageJson.content.dependencies,
            ...packageJson.content.devDependencies
        };
        const dependencies: string[] = [];
        for (const [key, version] of Object.entries(mergedDependencies)) {
            // This is the pnpm convention
            if (version?.startsWith('workspace:')) {
                dependencies.push(key);
            }
        }

        const node: GraphNode = {
            ...project,
            dependencies
        }

        res.push(node);
    }

    return res;
}