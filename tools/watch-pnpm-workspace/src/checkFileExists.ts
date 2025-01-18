
import fs from 'node:fs/promises';

export async function checkFileExists(filepath: string): Promise<boolean> {
    try {
        await fs.access(filepath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}