import { Dirent } from "node:fs";
import fsPromises from 'node:fs/promises';
import path from "node:path";

export async function getRealLocationForDirectory(item: Dirent): Promise<string | null> {
    if (item.isDirectory()) {
        const resolved = path.resolve(item.parentPath, item.name);
        return resolved;
    }
    else if (item.isSymbolicLink()) {
        const resolved = path.resolve(item.parentPath, item.name);
        const realpath = await fsPromises.realpath(resolved);
        if ((await fsPromises.stat(realpath)).isDirectory()) {
            return realpath;
        }
    }
    return null;
}