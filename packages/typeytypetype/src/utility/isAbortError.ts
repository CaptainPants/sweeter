export function isAbortError(ex: unknown): boolean {
    return ex instanceof DOMException && ex.name === 'AbortError';
}