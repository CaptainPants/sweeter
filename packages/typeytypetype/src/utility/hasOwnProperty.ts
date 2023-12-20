export function hasOwnProperty<const TKey extends string>(
    value: unknown,
    key: TKey,
): value is { [Key in TKey]: unknown } {
    return Object.prototype.hasOwnProperty.call(value, key);
}
