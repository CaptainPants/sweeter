export function assertNotNullOrUndefined<T>(
    value: T | undefined | null,
): asserts value is T {
    if (value === null || value === undefined)
        throw new TypeError(
            `Unexpected value ${value === null ? 'null' : 'undefined'}`,
        );
}
