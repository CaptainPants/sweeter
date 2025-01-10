import { typeAssert, type Or } from '../index.js';

it('IsUnion works', () => {
    typeAssert.extends<Or<[true, false]>, true>();
    
    typeAssert.extends<Or<[false, true, false]>, true>();

    typeAssert.extends<Or<[false, false, false]>, false>();
});
