/**
 * This is really just a ponyfill over Object.hasOwn -- but is probably not necessary as we are not planning to support older browsers (due to lack of WeakRef).
 * @param value
 * @param key
 * @returns
 */
export function hasOwnProperty<const TKey extends string>(
    value: unknown,
    key: TKey,
): value is { [Key in TKey]: unknown } {
    return Object.prototype.hasOwnProperty.call(value, key);
}
