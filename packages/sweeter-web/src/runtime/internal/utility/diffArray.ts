
/**
 * Return all items in a that are not in b;
 * @param a
 * @param b
 * @returns
 */
export function diffArray<T>(a: T[], b: T[]): T[] {
    if (b.length > 10) {
        const bSet = new Set(b);
        return a.filter((x) => !bSet.has(x));
    }

    return a.filter((x) => !b.includes(x));
}
