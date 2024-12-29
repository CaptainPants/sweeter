export function arrayElementsEqual<T>(
    a: readonly T[],
    b: readonly T[],
    elementEquals: (a: T, b: T) => boolean = Object.is,
): boolean {
    if (a.length !== b.length) return false;

    return a.every((aItem, index) => elementEquals(aItem, b[index] as T));
}
