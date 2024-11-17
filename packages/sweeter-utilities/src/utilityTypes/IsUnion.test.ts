import { IsUnion, type TypeMatchAssert } from '../index.js';

it('IsUnion works', () => {
    const _1: TypeMatchAssert<IsUnion<{ a: 1 } | { b: 2 }>, true> = true;

    const _2: TypeMatchAssert<IsUnion<{ a: 1 }>, false> = true;

    const _3: TypeMatchAssert<IsUnion<1 | 2>, true> = true;
});
