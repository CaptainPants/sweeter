import { splitByUnparenthesizedCommas } from './splitByUnparenthesizedCommas.js';

it('simple 1', () => {
    expect(splitByUnparenthesizedCommas('a,b,c')).toStrictEqual([
        'a',
        'b',
        'c',
    ]);
});

it('not 1', () => {
    expect(splitByUnparenthesizedCommas('a,:not(b,c)')).toStrictEqual([
        'a',
        ':not(b,c)',
    ]);
});

it('not 2', () => {
    expect(
        splitByUnparenthesizedCommas('a,:not(b,:not(d)), :not(e)'),
    ).toStrictEqual(['a', ':not(b,:not(d))', ':not(e)']);
});

it('multipart', () => {
    expect(
        splitByUnparenthesizedCommas(
            'a#banana > b.class, c d, a b > c:not(a.test, b#also)',
        ),
    ).toStrictEqual([
        'a#banana > b.class',
        'c d',
        'a b > c:not(a.test, b#also)',
    ]);
});