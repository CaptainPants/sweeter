import { deepEqual } from './deepEqual.js';

it('General true cases', () => {
    expect(deepEqual(1, 1)).toStrictEqual(true);
    expect(deepEqual('test', 'test')).toStrictEqual(true);
    expect(
        deepEqual(new Date(2023, 1, 1, 1, 2, 3), new Date(2023, 1, 1, 1, 2, 3)),
    ).toStrictEqual(true);
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toStrictEqual(true);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toStrictEqual(true);
});

it('General false cases', () => {
    expect(deepEqual(1, 2)).toStrictEqual(false);
    expect(deepEqual('test1', 'test2')).toStrictEqual(false);
    expect(
        deepEqual(new Date(2023, 1, 1, 1, 2, 3), new Date(2023, 1, 1, 1, 2, 4)),
    ).toStrictEqual(false);
    expect(deepEqual([1, 2, 3], [4, 3, 2])).toStrictEqual(false);
    expect(deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toStrictEqual(
        false,
    );
});
