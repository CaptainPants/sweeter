/**
 * Convenience function to throw an error as part of an expression, useful
 * in e.g. null coalescing.
 * @param err
 */
export function throwError(err: unknown): never {
    throw err;
}
