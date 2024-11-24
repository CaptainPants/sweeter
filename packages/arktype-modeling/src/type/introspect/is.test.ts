import { type } from "arktype";
import { isArrayType, isBooleanFalseLiteral, isBooleanLiteralType, isBooleanTrueLiteral, isBooleanType, isNullConstant, isNumberLiteralType, isNumberType, isObjectType, isStringLiteralType, isStringType, isUndefinedConstant, isUnionType, isUnknownType } from "./is";
import { AnyTypeConstraint } from "../AnyTypeConstraint";

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
    isUnknownType
} satisfies Record<string, (input: AnyTypeConstraint) => boolean>;

function testAll(input: AnyTypeConstraint, shouldReturnTrue: readonly (keyof typeof isFuncs)[]) {
    for (const [name, test] of Object.entries(isFuncs)) {
        const expected = shouldReturnTrue.includes(name as keyof typeof isFuncs);

        if (test(input) !== expected) {
            let j = 0;
        }

        const actual = test(input);

        expect(actual, `${name}(${input.expression}) was unexpectedly ${actual}`).toStrictEqual(expected);
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
    unknown: type.unknown
};

test('is', () => {
    
    testAll(schemas.number, ['isNumberType']);
    testAll(schemas.object, ['isObjectType']);
    testAll(schemas.array, ['isArrayType']);
    testAll(schemas.union, ['isUnionType']);
    testAll(schemas.number, ['isNumberType']);
    testAll(schemas.string, ['isStringType']);
    testAll(schemas.boolean, ['isBooleanType', 'isUnionType']);
    testAll(schemas.number_literal, ['isNumberLiteralType']);
    testAll(schemas.string_literal, ['isStringLiteralType']);
    testAll(schemas.boolean_literal, ['isBooleanLiteralType', 'isBooleanFalseLiteral']);
    testAll(schemas.true, ['isBooleanLiteralType', 'isBooleanTrueLiteral']);
    testAll(schemas.false, ['isBooleanLiteralType', 'isBooleanFalseLiteral']);
    testAll(schemas.null, ['isNullConstant']);
    testAll(schemas.undefined, ['isUndefinedConstant']);
    testAll(schemas.unknown, ['isUnknownType']);
})