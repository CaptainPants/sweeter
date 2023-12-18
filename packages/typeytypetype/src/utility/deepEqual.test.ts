import { deepEqual } from "./deepEqual.js"

it('General true cases', () => {
    expect(deepEqual(1, 1)).toStrictEqual(true);
    expect(deepEqual('test', 'test')).toStrictEqual(true);
    expect(deepEqual(new Date(2023, 1, 1, 1, 2, 3), new Date(2023, 1, 1, 1, 2, 3))).toStrictEqual(true);
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toStrictEqual(true);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2})).toStrictEqual(true);
});