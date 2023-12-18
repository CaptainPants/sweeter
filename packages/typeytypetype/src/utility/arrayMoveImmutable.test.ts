

import { arrayMoveImmutable } from './arrayMoveImmutable.js';

test('arrayMoveImmutable', async () => {
    expect(arrayMoveImmutable([1, 2, 3], 2, 1)).toStrictEqual([1, 3, 2]);
    expect(arrayMoveImmutable([1, 2, 3], 1, 2)).toStrictEqual([1, 3, 2]);
    expect(arrayMoveImmutable([1, 2, 3], 0, 2)).toStrictEqual([2, 3, 1]);
});
