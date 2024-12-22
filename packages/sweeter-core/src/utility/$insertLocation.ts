import { StackTrace } from '@captainpants/sweeter-utilities';

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
    const stackTrace = new StackTrace({ skipFrames: 1 });
    const top = stackTrace.getFirstLocation();
    if (!top) throw new Error('Location not found');
    return top;
}
