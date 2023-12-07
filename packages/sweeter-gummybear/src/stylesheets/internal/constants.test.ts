import { columnWidthNames, columnWidths } from './constants.js';

it('Constants match', () => {
    expect(columnWidthNames.length).toStrictEqual(columnWidths.length);

    for (let i = 0; i < columnWidthNames.length; ++i) {
        expect(columnWidthNames[i]).toStrictEqual(`_${columnWidths[i]}`);
    }
});
