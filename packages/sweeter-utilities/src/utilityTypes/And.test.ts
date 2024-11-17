import { type And, type TypeMatchAssert } from '../index.js';

it('IsUnion works', () => {
    assertType;
    const _1: TypeMatchAssert<And<[true, true]>, true> = true;

    const _2: TypeMatchAssert<And<[true, true, true]>, true> = true;

    const _3: TypeMatchAssert<And<[true, true, false]>, false> = true;
});
