export function isText(value: unknown): value is string | number {
    const type = typeof value;
    return type === 'string' || type === 'number';
}
