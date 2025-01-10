import { type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import {
    getObjectTypeInfo,
    tryGetObjectTypeInfo,
} from './getObjectTypeInfo.js';
import { isLiteralValue } from './is.js';

test('general', () => {
    const schema = type({
        test: '1',
        '[string]': 'string',
        '[symbol]': 'number',
    });

    const info = getObjectTypeInfo(schema);
    const fixedProps = info.getFixedProperties();

    expect(fixedProps.size).toStrictEqual(1);
    expect(
        isLiteralValue(
            fixedProps.get('test') ?? throwError('Expected a match'),
            1,
        ),
    );

    const _keys = info.getMappedKeys();
    // TODO: tests about mapped keys
});

test.only('should not be an object', () => {
    const schema = type.string.array();

    const info = tryGetObjectTypeInfo(schema);

    expect(info).toBeUndefined();
});
