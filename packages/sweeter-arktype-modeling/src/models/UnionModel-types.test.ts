/* eslint-disable @typescript-eslint/no-unused-vars */

import { type Type, type } from 'arktype';

import { typeAssert } from '@captainpants/sweeter-utilities';

import { arkTypeUtilityTypes } from '../utility/arkTypeUtilityTypes.js';

import { SpreadModel } from './Model.js';
import { ModelFactory } from './ModelFactory.js';

test('union', async () => {
    const expected = type.unit(1);
    const unionType = expected.or(type.unit(2)).or(type.string);

    typeAssert.equal<typeof unionType, Type<1 | 2 | string>>();

    const model = await ModelFactory.createModel({
        value: 1,
        schema: unionType,
    });

    const value1: 1 | 2 | string = model.value;

    expect(value1).toStrictEqual(1);

    const resolved = model.resolve();

    expect(resolved.type).toStrictEqual(expected);

    expect(resolved.value).toStrictEqual(1);
});
