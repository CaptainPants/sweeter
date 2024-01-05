import { type ColumnWidth, type ColumnWidthIdentifier } from '../types.js';

/**
 * Takes a column 'width' number between 1 and 12, or the keyword 'auto' and returns the identifier needed to
 * extract a classname from the columns object.
 * @param columnWidth
 * @returns
 */
export function columnWidthToIdentifier(
    columnWidth: ColumnWidth,
): ColumnWidthIdentifier {
    if (columnWidth == 'auto') {
        return 'auto';
    } else if (typeof columnWidth === 'number') {
        if (columnWidth >= 1 && columnWidth <= 12) {
            return `_${columnWidth}`;
        }
    }

    throw new TypeError(`Unexpected value ${columnWidth}`);
}
