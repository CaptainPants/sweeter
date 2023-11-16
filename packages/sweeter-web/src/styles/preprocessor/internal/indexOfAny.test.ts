import { indexOfAny } from './indexOfAny.js';

it('indexOfAny 1', () => {
    const res = indexOfAny(
        ['a'.charCodeAt(0), 'b'.charCodeAt(0)],
        'abcdabcd',
        2,
    );

    expect(res).toStrictEqual(4);
});

it('indexOfAny 2', () => {
    const res = indexOfAny(
        ['a'.charCodeAt(0), 'b'.charCodeAt(0)],
        'abcdabcd',
        1,
    );

    expect(res).toStrictEqual(1);
});
