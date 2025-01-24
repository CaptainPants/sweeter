export function normalizePath(path: string, to: '/' | '\\'): string {
    return path.replace(/\\|\//g, to);
}
