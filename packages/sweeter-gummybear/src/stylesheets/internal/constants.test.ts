import {
    columnWidthIdentifiers,
    columnWidthNames,
    columnWidths,
} from './constants.js';

it('Constants match', () => {
    expect(columnWidthNames.length).toStrictEqual(columnWidths.length);
    expect(columnWidthIdentifiers.length).toStrictEqual(columnWidths.length);

    for (let i = 0; i < columnWidthNames.length; ++i) {
        if (columnWidths[i] === undefined) {
            expect(columnWidthIdentifiers[i]).toStrictEqual('auto');
            expect(columnWidthIdentifiers[i]).toStrictEqual(
                columnWidthNames[i],
            );
        } else {
            expect(columnWidthIdentifiers[i]).toStrictEqual(
                `_${columnWidths[i]}`,
            );
            expect(columnWidthIdentifiers[i]).toStrictEqual(
                `_${columnWidthNames[i]}`,
            );
        }
    }
});
