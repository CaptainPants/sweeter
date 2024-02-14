/* eslint-disable @typescript-eslint/no-unused-vars */

import { type TypeMatchAssert } from '../testing.js';
import { type ValueTypeFromType } from '../types.js';
import { Types } from '../types/Types.js';

import { applyTypeToModel } from './applyTypeToModel.js';
import { ModelFactory } from './ModelFactory.js';
import { type PropertyModel } from './PropertyModel.js';

test('Something', async () => {
    const unionType = Types.union(
        Types.object({
            type: Types.prop(Types.constant('a')),
        }),
        Types.object({
            type: Types.prop(Types.constant('b')),
            otherProperty: Types.prop(Types.string()),
        }),
    );

    const value: ValueTypeFromType<typeof unionType> = {
        type: 'b',
        otherProperty: 'Something',
    };

    const model = await ModelFactory.createModel({ type: unionType, value });

    const retyped = await applyTypeToModel(
        model,
        Types.object({ type: Types.prop(Types.constant('b')) }),
    );

    const type = retyped.getProperty('type');
    const assertType1: TypeMatchAssert<typeof type, PropertyModel<'b'>> = true;

    expect(type.valueModel.value).toStrictEqual('b');
});
