import path from "node:path";
import fs from 'node:fs/promises';

import { checkFileExists } from "./checkFileExists.ts";

export async function findWorkspaceRoot(startFrom: string) {
    const filename = 'pnpm-workspace.yaml';

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