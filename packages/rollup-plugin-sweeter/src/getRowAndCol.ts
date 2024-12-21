import { newlinesBetween } from './newlinesBetween';

export function getRowAndCol(
    code: string,
    offset: number,
): [row: number, col: number] {
    const upToOffset = code.substring(0, offset);

    const row = newlinesBetween(code, 0, offset); // number of lines = number of \n + 1

    let startOfLine = upToOffset.lastIndexOf('\n') + 1; // move beyond the newline character and (-1 => 0)

    const col = offset - startOfLine;

    return [row, col + 1 /* 1-based */];
}
