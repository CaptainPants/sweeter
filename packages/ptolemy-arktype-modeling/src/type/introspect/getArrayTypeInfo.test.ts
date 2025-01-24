import { type } from 'arktype';

import { getArrayTypeInfo } from './getArrayTypeInfo.js';

test('Single element type', () => {
    const input = type.string;
    const typeInfo = getArrayTypeInfo(input.array());

    expect(typeInfo.elementType).toStrictEqual(input);
});

test('Union element type', () => {
    const input = type.string.or(type.number);
    const typeInfo = getArrayTypeInfo(input.array());

    expect(typeInfo.elementType).toStrictEqual(input);
});
