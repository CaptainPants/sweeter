export function or<T>(
    iterable: Iterable<T>,
    callback: (value: T) => boolean,
): boolean {
    for (const item of iterable) {
        const res = callback(item);
        if (res) return true;
    }
    return false;
}
export function and<T>(
    iterable: Iterable<T>,
    callback: (value: T) => boolean,
): boolean {
    for (const item of iterable) {
        const res = callback(item);
        if (!res) return false;
    }
    return true;
}
