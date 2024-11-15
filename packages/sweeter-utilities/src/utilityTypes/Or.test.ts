import { Or, type TypeMatchAssert } from '../index.js';

it('IsUnion works', () => {
    const _1: TypeMatchAssert<
        Or<[true, false]>,
        true
    > = true;

    const _2: TypeMatchAssert<
        Or<[false, true, false]>,
        true
    > = true;

    const _3: TypeMatchAssert<
        Or<[false, false, false]>,
        false
    > = true;
});
