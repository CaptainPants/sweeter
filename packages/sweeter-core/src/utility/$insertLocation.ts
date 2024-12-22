export type CodeLocation = [
    file: string,
    method: string,
    row: number,
    col: number,
];

/**
 * Inject the filename/function name, row and column at the location of this function call.
 * This is performed by the rollup plugin.
 */
export function $insertLocation(): CodeLocation {
    throw new Error(
        'TODO: implement a fallback runtime version of this function using stack trace',
    );
}
