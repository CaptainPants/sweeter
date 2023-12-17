export function assertNotNullOrUndefined<T>(
    value: T,
): asserts value is NonNullable<T> {
    if (value === null || value === undefined)
        throw new TypeError('Value was not expected to be null or undefined.');
}
