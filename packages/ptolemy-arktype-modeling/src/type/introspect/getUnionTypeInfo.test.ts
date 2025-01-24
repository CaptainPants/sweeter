import { type } from 'arktype';

import { getLiteralTypeInfo } from './getLiteralTypeInfo.js';
import { getUnionTypeInfo, tryGetUnionTypeInfo } from './getUnionTypeInfo.js';

test('branches contains expected items', () => {
    const schemas = {
        ex1: type.unit(1).or(type.unit('test')),
        not_union: type.unit(1),
    };

    const ex1Branches = getUnionTypeInfo(schemas.ex1).branches;
    const values = ex1Branches.map((x) => getLiteralTypeInfo(x).value);
    expect(values.length).toStrictEqual(2);
    expect(values).toContain(1);
    expect(values).toContain('test');

    expect(tryGetUnionTypeInfo(schemas.not_union)).toStrictEqual(undefined);
});
