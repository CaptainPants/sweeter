import fsPromises from 'node:fs/promises';
import path from "node:path";

import { fileExists } from '../utility/implementation/fileExists.js';
import { normalizePath } from "../utility/implementation/normalizePath.js";

import { getRealLocationForDirectory } from "./getRealLocationForDirectory.js";


export async function gatherDependencies(projectRoot: string): Promise<{ name: string, realPath: string }[]> {
    projectRoot = normalizePath(projectRoot, path.sep);
    const nodeModulesPath = path.resolve(projectRoot, 'node_modules');

    console.warn('Starting at ' + nodeModulesPath)

    const dependencies: { name: string, realPath: string }[] = [];

    const topLevelEntries = await fsPromises.readdir(nodeModulesPath, { withFileTypes: true });

    for (const item of topLevelEntries) {
        const itemLocation = await getRealLocationForDirectory(item);

        if (itemLocation === null) {
            continue;
        }

        // scoped (a folder starting with @ is a scope and contains projects)
        if (item.name.startsWith('@')) {
            const scopedDir = path.resolve(nodeModulesPath, item.name);

            for (const scopedItem of await fsPromises.readdir(scopedDir, { withFileTypes: true })) {
                const scopedItemLocation = await getRealLocationForDirectory(scopedItem);

                if (scopedItemLocation === null) {
                    continue;
                }

                const scopedCandidatePackageJson = path.resolve(scopedItemLocation, 'package.json');
                if (await fileExists(scopedCandidatePackageJson)) {
                    dependencies.push({ name: item.name + '/' + scopedItem.name, realPath: scopedItemLocation });
                }
            }

            continue;
        }

        // Non-scoped, could be a package
        const candidatePackageJson = path.resolve(itemLocation, 'package.json');
        if (await fileExists(candidatePackageJson)) {
            dependencies.push({ name: item.name, realPath: itemLocation });
        }
    }

    return dependencies;
}