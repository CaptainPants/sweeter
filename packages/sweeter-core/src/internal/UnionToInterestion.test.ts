import type { TypeMatchAssert } from '../index.js';
import type { UnionToIntersection } from './UnionToIntersection.js';

it('UnionToIntersection works', () => {
    const _text1: TypeMatchAssert<
        UnionToIntersection<{ a: 1 } | { b: 2 }>,
        { a: 1 } & { b: 2 }
    > = true;
});
