import { type Type, type } from 'arktype';

import { typeAssert } from '@captainpants/sweeter-utilities';

import { applyTypeToModel } from './applyTypeToModel.js';
import { ModelFactory } from './ModelFactory.js';
import { type PropertyModel } from './PropertyModel.js';

test('Something', async () => {
    const unionType = type({
        type: type.unit('a'),
    }).or({
        type: type.unit('b'),
        otherProperty: type.string,
    });

    const value: type.infer<typeof unionType> = {
        type: 'b',
        otherProperty: 'Something',
    };

    const model = await ModelFactory.createModel<typeof unionType>({
        schema: unionType,
        value,
    });

    const partType = type({ type: type.unit('b') });

    const retyped = await applyTypeToModel(model, partType);

    const typeProperty = retyped.getProperty('type');

    typeAssert.equal<typeof typeProperty, PropertyModel<Type<'b'>>>();

    expect(typeProperty.valueModel.value).toStrictEqual('b');
});
