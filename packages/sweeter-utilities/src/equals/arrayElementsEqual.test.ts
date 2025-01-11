import { arrayElementsEqual } from './arrayElementsEqual.js';

it('Looks right', () => {
    expect(arrayElementsEqual([1, 2, 3], [1, 2, 3])).toStrictEqual(true);

    expect(arrayElementsEqual([1, 2, 3], [1, 2])).toStrictEqual(false); // Missing an element
    expect(arrayElementsEqual([1, 2, 3], [3, 2, 1])).toStrictEqual(false); // Same elements in wrong order
    expect(arrayElementsEqual([1, 2, 3], [1, 2, 3, 4])).toStrictEqual(false); // Extra element in order
});
