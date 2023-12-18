

import { type ValueTypeFromType } from '../types.js';
import { Types } from '../types/Types.js';

import { ModelFactory } from './ModelFactory.js';

test('rigid-object', async () => {
    // Arrange
    const type = Types.object({
        num: Types.prop(Types.number()),
        str: Types.prop(Types.string()),
    });

    const value: ValueTypeFromType<typeof type> = {
        num: 1,
        str: 'banana',
    };

    const model = await ModelFactory.createModel({ value, type });

    // Act
    const updated = await model.setPropertyValue('num', 2);

    // Assert
    expect(updated.value).toStrictEqual({ num: 2, str: 'banana' });
});
