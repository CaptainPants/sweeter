import { type } from 'arktype';

import {
    getLiteralTypeInfo,
    tryGetLiteralTypeInfo,
} from './getLiteralTypeInfo.js';

it('getLiteralTypeInfo returns correct value', () => {
    const schemas = {
        number: type.unit(1),
        string: type.unit('test'),
        true: type.unit(true),
        false: type.unit(false),
        null1: type.null,
        null2: type.unit(null),
        undefined1: type.undefined,
        undefined2: type.unit(undefined),
        non_unit: type({ test: type.unit(1) }),
    };

    expect(getLiteralTypeInfo(schemas.number).value).toStrictEqual(1);
    expect(getLiteralTypeInfo(schemas.string).value).toStrictEqual('test');
    expect(getLiteralTypeInfo(schemas.true).value).toStrictEqual(true);
    expect(getLiteralTypeInfo(schemas.false).value).toStrictEqual(false);
    expect(getLiteralTypeInfo(schemas.null1).value).toStrictEqual(null);
    expect(getLiteralTypeInfo(schemas.null2).value).toStrictEqual(null);
    expect(getLiteralTypeInfo(schemas.undefined1).value).toStrictEqual(
        undefined,
    );
    expect(getLiteralTypeInfo(schemas.undefined2).value).toStrictEqual(
        undefined,
    );
    expect(tryGetLiteralTypeInfo(schemas.non_unit)).toStrictEqual(undefined);
});
