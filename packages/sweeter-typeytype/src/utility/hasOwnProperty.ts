export function hasOwnProperty(value: unknown, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(value, key);
}
