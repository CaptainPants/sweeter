/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */


import { type TypeMatchAssert } from '../testing.js';

import { type IsUnion } from './unions.js';

test('IsUnion', () => {
    // No change as the top level is a union not an OpaqueUnion
    const test1: TypeMatchAssert<IsUnion<1 | 2>, true> = true;

    const test2: TypeMatchAssert<IsUnion<1>, false> = true;
});
