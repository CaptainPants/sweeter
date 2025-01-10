import { typeAssert, type IsUnion } from '../index.js';

it('IsUnion works', () => {
    typeAssert.extends<IsUnion<{ a: 1 } | { b: 2 }>, true>();

    typeAssert.extends<IsUnion<{ a: 1 }>, false>();

    typeAssert.extends<IsUnion<1 | 2>, true>();
});
