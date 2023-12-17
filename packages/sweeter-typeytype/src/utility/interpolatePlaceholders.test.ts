

import { interpolatePlaceholders } from './interpolatePlaceholders.js';

test('interpolatePlaceholders', async () => {
    expect(interpolatePlaceholders(null, [1])).toStrictEqual('');
    expect(interpolatePlaceholders('test', [1])).toStrictEqual('test');
    expect(interpolatePlaceholders('test {0}', [1, 2])).toStrictEqual('test 1');
    expect(interpolatePlaceholders('test {1}', [1, 2])).toStrictEqual('test 2');
    expect(interpolatePlaceholders('test {1:format}', [1, 2])).toStrictEqual(
        'test 2',
    );
});
