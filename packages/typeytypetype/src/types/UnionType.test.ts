

import { type TypeMatchAssert } from '../testing.js';

import { Types } from './Types.js';
import { type UnionType } from './UnionType.js';

test('union', async () => {
    const unionType = Types.union(
        Types.union(Types.constant(1), Types.constant(2)),
        Types.string(),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const typeTest1: TypeMatchAssert<
        typeof unionType,
        UnionType<string | 1 | 2>
    > = true;
});
