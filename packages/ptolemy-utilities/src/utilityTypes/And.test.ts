import { type And, typeAssert } from '../index.js';

it('IsUnion works', () => {
    typeAssert.extends<And<[true, true]>, true>();

    typeAssert.extends<And<[true, true, true]>, true>();

    typeAssert.extends<And<[true, true, false]>, false>();
});
