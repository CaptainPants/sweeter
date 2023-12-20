import { assertNotNullOrUndefined } from './assertNotNullOrUndefined.js';

test('assertNotNullOrUndefined', async () => {
    assertNotNullOrUndefined(1);

    expect(() => {
        assertNotNullOrUndefined(null);
    }).toThrowError(
        new TypeError('Value was not expected to be null or undefined.'),
    );
    expect(() => {
        assertNotNullOrUndefined(undefined);
    }).toThrowError(
        new TypeError('Value was not expected to be null or undefined.'),
    );
});
