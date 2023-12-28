import { assertNotNullOrUndefined } from './assertNotNullOrUndefined.js';

test('assertNotNullOrUndefined', async () => {
    assertNotNullOrUndefined(1);

    expect(() => {
        assertNotNullOrUndefined(null);
    }).toThrowError(new TypeError('Unexpected value null'));
    expect(() => {
        assertNotNullOrUndefined(undefined);
    }).toThrowError(new TypeError('Unexpected value undefined'));
});
