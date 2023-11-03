export function stringifyForDiagnostics(val: unknown): string {
    try {
        return JSON.stringify(val);
    } catch {
        // try something else
    }

    try {
        return String(val);
    } catch {
        // try something else
    }

    return '<COULD NOT STRINGIFY>';
}
