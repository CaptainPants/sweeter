import { type } from "arktype";
import { getObjectTypeInfo } from "./getObjectTypeInfo";
import { isLiteralValue, isNumberType, isStringType } from "./is";
import { throwError } from "@captainpants/sweeter-utilities";

test('general', () => {
    const schema = type({
        'test': '1',
        '[string]': 'string',
        '[symbol]': 'number'
    });

    const info = getObjectTypeInfo(schema);

    expect(info.fixedProps.size).toStrictEqual(1);
    expect(isLiteralValue(info.fixedProps.get('test') ?? throwError('Expected a match'), 1))
    expect(isStringType(info.stringMappingType ?? throwError('Expected a match'))).toStrictEqual(true);
    expect(isNumberType(info.symbolMappingType ?? throwError('Expected a match'))).toStrictEqual(true);
});