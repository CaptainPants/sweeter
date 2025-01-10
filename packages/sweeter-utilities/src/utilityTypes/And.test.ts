import { typeAssert, type And } from '../index.js';

it('IsUnion works', () => {
    typeAssert.extends<And<[true, true]>, true>();

    typeAssert.extends<And<[true, true, true]>, true>();

    typeAssert.extends<And<[true, true, false]>, false>();
});
