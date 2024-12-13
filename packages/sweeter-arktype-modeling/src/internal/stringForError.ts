export function stringForError(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return '<could not convert to string>';
    }
}
