import { type } from 'arktype';
import { getObjectTypeInfo } from './getObjectTypeInfo.js';
import { isLiteralValue } from './is.js';
import { throwError } from '@captainpants/sweeter-utilities';

test('general', () => {
    const schema = type({
        test: '1',
        '[string]': 'string',
        '[symbol]': 'number',
    });

    const info = getObjectTypeInfo(schema);
    const fixedProps = info.getProperties();

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
