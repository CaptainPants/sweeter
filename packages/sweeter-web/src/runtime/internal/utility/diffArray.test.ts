import { diffArray } from "./diffArray.js";

it('general', () => {
    // Remove nothing
    expect(diffArray([1, 2, 3, 4], [])).toStrictEqual([1, 2, 3, 4]);

    // Remove 1 item
    expect(diffArray([1, 2, 3, 4], [1])).toStrictEqual([2, 3, 4]);

    // Remove 2 items
    expect(diffArray([1, 2, 3, 4], [2, 3])).toStrictEqual([1, 4]);

    // Remove the first 2 items
    expect(diffArray([1, 2, 3, 4], [1, 2])).toStrictEqual([3, 4]);

    // Remove the last 2 items
    expect(diffArray([1, 2, 3, 4], [3, 4])).toStrictEqual([1, 2]);

    // Remove 2 items out of order
    expect(diffArray([1, 2, 3, 4], [4, 1])).toStrictEqual([2, 3]);

    // Remove 2 items out of order
    expect(diffArray([1, 2, 3, 4], [2, 1])).toStrictEqual([3, 4]);
});