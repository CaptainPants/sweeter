
export function isAbortError(ex: unknown): boolean {
    if (typeof DOMException === 'undefined')
        throw new TypeError('DOMException not found');

    return ex instanceof DOMException && ex.name === 'AbortError';
}
