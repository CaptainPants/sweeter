/**
 * Utility for setting a depth limit on recursive function calls.
 * @param depth
 * @returns
 */
export function descend(depth: number): number {
    if (depth <= 0) {
        throw descend.error();
    }
    return depth - 1;
}
descend.defaultDepth = 25;
descend.error = function () {
    return new Error('Depth limit exceeded');
};
