import { readSelectors } from './readSelectors.js';

it('simple 1', () => {
    expect(readSelectors('a,b,c', 0)).toStrictEqual({ 
        selectors: ['a', 'b', 'c'],
        endOffset: 5
    });
});

it('with quoted attribute selector', () => {
    expect(readSelectors('a[href^="http://"], test', 0)).toStrictEqual({ 
        selectors: ['a[href^="http://"]', 'test'],
        endOffset: 24
    });
});

it('not 1', () => {
    expect(readSelectors('a,:not(b,c)', 0)).toStrictEqual({
        selectors: [
            'a',
            ':not(b,c)',
        ],
        endOffset: 11
    });
});

it('not 2', () => {
    expect(
        readSelectors('a,:not(b,:not(d)), :not(e)', 0),
    ).toStrictEqual({
        selectors: ['a', ':not(b,:not(d))', ':not(e)'],
        endOffset: 26
    });
});

it('multipart', () => {
    expect(
        readSelectors(
            'a#banana > b.class, c d, a b > c:not(a.test, b#also)',
            0,
        ),
    ).toStrictEqual({
        selectors: [
            'a#banana > b.class',
            'c d',
            'a b > c:not(a.test, b#also)',
        ],
        endOffset: 52
    });
});
