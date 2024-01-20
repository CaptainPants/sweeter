import { arrayRemove } from "./arrayRemove.js";

it('General', () => {
    const list1 = [1, 2, 3, 4, 1, 2, 3, 4];

    arrayRemove(list1, 1);

    expect(list1).toStrictEqual([2, 3, 4, 2, 3, 4]);
})