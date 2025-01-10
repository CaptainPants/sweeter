import { type ColumnWidth } from '../types.js';

import { columnWidthToIdentifier } from './columnWidthToIdentifier.js';

it('General', () => {
    expect(columnWidthToIdentifier(1)).toStrictEqual('_1');
    expect(columnWidthToIdentifier(2)).toStrictEqual('_2');
    expect(columnWidthToIdentifier(3)).toStrictEqual('_3');
    expect(columnWidthToIdentifier(4)).toStrictEqual('_4');
    expect(columnWidthToIdentifier(5)).toStrictEqual('_5');
    expect(columnWidthToIdentifier(6)).toStrictEqual('_6');
    expect(columnWidthToIdentifier(7)).toStrictEqual('_7');
    expect(columnWidthToIdentifier(8)).toStrictEqual('_8');
    expect(columnWidthToIdentifier(9)).toStrictEqual('_9');
    expect(columnWidthToIdentifier(10)).toStrictEqual('_10');
    expect(columnWidthToIdentifier(11)).toStrictEqual('_11');
    expect(columnWidthToIdentifier(12)).toStrictEqual('_12');
    expect(columnWidthToIdentifier('auto')).toStrictEqual('auto');
}),
    it('Failure', () => {
        expect(() =>
            columnWidthToIdentifier(undefined as unknown as ColumnWidth),
        ).toThrow(new TypeError(`Unexpected value ${undefined}`));
        expect(() => columnWidthToIdentifier(13 as ColumnWidth)).toThrow(
            new TypeError(`Unexpected value 13`),
        );
        expect(() => columnWidthToIdentifier(-1 as ColumnWidth)).toThrow(
            new TypeError(`Unexpected value -1`),
        );
    });
