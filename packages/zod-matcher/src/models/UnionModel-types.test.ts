/* eslint-disable @typescript-eslint/no-unused-vars */

import { type TypeMatchAssert } from '../testing.js';
import { Types } from '../metadata/Types.js';
import { type UnionType } from '../metadata/UnionType.js';

import { type NumberConstantModel, type StringModel } from './Model.js';
import { ModelFactory } from './ModelFactory.js';

test('union', async () => {
    const nested = Types.union(Types.constant(1), Types.constant(2));

    const unionType = Types.union(nested, Types.string());

    const typeTest1: TypeMatchAssert<
        typeof unionType,
        UnionType<string | 1 | 2>
    > = true;

    const model = await ModelFactory.createModel({ value: 1, type: unionType });

    const value1: 1 | 2 | string = model.value;

    expect(value1).toStrictEqual(1);

    const recursivelyResolved = model.getRecursivelyResolved();

    const typeTest2: TypeMatchAssert<
        typeof recursivelyResolved,
        StringModel | NumberConstantModel<1> | NumberConstantModel<2>
    > = true;

    const typeTest3: TypeMatchAssert<
        typeof recursivelyResolved.value,
        1 | 2 | string
    > = true;

    const resolved = model.getDirectlyResolved();

    expect(resolved.type).toStrictEqual(nested);
    expect(resolved.value).toStrictEqual(1);
});
