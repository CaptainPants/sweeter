import fsPromises, { access } from 'node:fs/promises';

export async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path, fsPromises.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}
