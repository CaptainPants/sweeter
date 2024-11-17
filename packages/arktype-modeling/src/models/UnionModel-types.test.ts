/* eslint-disable @typescript-eslint/no-unused-vars */

import { Type, type } from 'arktype';
import { type TypeMatchAssert } from '../testingTypes.js';

import { type NumberConstantModel, type StringModel } from './Model.js';
import { ModelFactory } from './ModelFactory.js';

test('union', async () => {
    const nested = type.unit(1).or(type.unit(2));

    const unionType = nested.or(type.string);

    const typeTest1: TypeMatchAssert<
        typeof unionType,
        Type<1 | 2 | string>
    > = true;

    const model = await ModelFactory.createModel({
        value: 1,
        schema: unionType,
    });

    const value1: 1 | 2 | string = model.value;

    expect(value1).toStrictEqual(1);

    const resolved = model.getDirectlyResolved();

    expect(resolved.type).toStrictEqual(nested);
    expect(resolved.value).toStrictEqual(1);
});
