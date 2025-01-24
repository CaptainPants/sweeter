import { type } from 'arktype';

import { type AnyTypeConstraint, UnknownType } from '../types.js';

import {
    isArrayType,
    isBooleanFalseLiteral,
    isBooleanLiteralType,
    isBooleanTrueLiteral,
    isBooleanType,
    isNullConstant,
    isNumberLiteralType,
    isNumberType,
    isObjectType,
    isStringLiteralType,
    isStringType,
    isUndefinedConstant,
    isUnionType,
    isUnknownType,
} from './is.js';

const isFuncs = {
    isObjectType,
    isArrayType,
    isUnionType,
    isNumberType,
    isStringType,
    isBooleanType,
    isNumberLiteralType,
    isStringLiteralType,
    isBooleanLiteralType,
    isBooleanTrueLiteral,
    isBooleanFalseLiteral,
    isNullConstant,
    isUndefinedConstant,
    isUnknownType,
} satisfies Record<string, (input: UnknownType) => boolean>;

function tryAll(
    input: AnyTypeConstraint,
    shouldReturnTrue: readonly (keyof typeof isFuncs)[],
) {
    for (const [name, test] of Object.entries(isFuncs)) {
        const expected = shouldReturnTrue.includes(
            name as keyof typeof isFuncs,
        );

        const actual = test(input);

        expect(
            actual,
            `${name}(${input.expression}) was unexpectedly ${actual}`,
        ).toStrictEqual(expected);
    }
}

const schemas = {
    object: type({ test: type.number }),
    array: type.string.array(),
    union: type.string.or(type.number),
    number: type.number,
    string: type.string,
    boolean: type.boolean,
    number_literal: type.unit(1),
    string_literal: type.unit('test'),
    boolean_literal: type.unit(false),
    true: type.true,
    false: type.false,
    null: type.null,
    undefined: type.undefined,
    unknown: type.unknown,
};

test('is', () => {
    tryAll(schemas.object, ['isObjectType']);
    tryAll(schemas.array, ['isArrayType']);
    tryAll(schemas.union, ['isUnionType']);
    tryAll(schemas.number, ['isNumberType']);
    tryAll(schemas.string, ['isStringType']);
    tryAll(schemas.boolean, ['isBooleanType', 'isUnionType']);
    tryAll(schemas.number_literal, ['isNumberLiteralType']);
    tryAll(schemas.string_literal, ['isStringLiteralType']);
    tryAll(schemas.boolean_literal, [
        'isBooleanLiteralType',
        'isBooleanFalseLiteral',
    ]);
    tryAll(schemas.true, ['isBooleanLiteralType', 'isBooleanTrueLiteral']);
    tryAll(schemas.false, ['isBooleanLiteralType', 'isBooleanFalseLiteral']);
    tryAll(schemas.null, ['isNullConstant']);
    tryAll(schemas.undefined, ['isUndefinedConstant']);
    tryAll(schemas.unknown, ['isUnknownType']);
});
