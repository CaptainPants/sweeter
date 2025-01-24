import { typeAssert } from '../index.js';

import { type UnionToIntersection } from './UnionToIntersection.js';

it('UnionToIntersection works', () => {
    typeAssert.extends<
        UnionToIntersection<{ a: 1 } | { b: 2 }>,
        { a: 1 } & { b: 2 }
    >();
});
