/* eslint-disable @typescript-eslint/no-unused-vars */

import { Type, type } from 'arktype';

import { type TypeMatchAssert } from '../testingTypes.js';
import { type ValueTypeFromArkType } from '../types.js';

import { applyTypeToModel } from './applyTypeToModel.js';
import { ModelFactory } from './ModelFactory.js';
import { type PropertyModel } from './PropertyModel.js';

test('Something', async () => {
    const unionType = type({
            type: type.unit('a'),
        })
        .or({
            type: type.unit('b'),
            otherProperty: type.string,
        });

    const value: ValueTypeFromArkType<typeof unionType> = {
        type: 'b',
        otherProperty: 'Something',
    };

    const model = await ModelFactory.createModel({ arkType: unionType, value });

    const retyped = await applyTypeToModel(
        model,
        type({ type: type.unit('b') }),
    );

    const typeProperty = retyped.getProperty('type');
    const assertType1: TypeMatchAssert<
        typeof type,
        PropertyModel<Type<'b'>>
    > = true;

    expect(typeProperty.valueModel.value).toStrictEqual('b');
});
