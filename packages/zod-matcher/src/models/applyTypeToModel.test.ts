/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from 'zod';
import { type TypeMatchAssert } from '../testing.js';
import { type ValueTypeFromZodType } from '../types.js';

import { applyTypeToModel } from './applyTypeToModel.js';
import { ModelFactory } from './ModelFactory.js';
import { type PropertyModel } from './PropertyModel.js';

test('Something', async () => {
    const unionType = z.union([
        z.object({
            type: z.literal('a'),
        }),
        z.object({
            type: z.literal('b'),
            otherProperty: z.string(),
        }),
    ]);

    const value: ValueTypeFromZodType<typeof unionType> = {
        type: 'b',
        otherProperty: 'Something',
    };

    const model = await ModelFactory.createModel({ type: unionType, value });

    const retyped = await applyTypeToModel(
        model,
        z.object({ type: z.literal('b') }),
    );

    const type = retyped.getProperty('type');
    const assertType1: TypeMatchAssert<typeof type, PropertyModel<'b'>> = true;

    expect(type.valueModel.value).toStrictEqual('b');
});
