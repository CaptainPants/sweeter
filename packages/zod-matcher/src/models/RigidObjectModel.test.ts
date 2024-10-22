import { type ValueTypeFromZodType } from '../types.js';
import { Types } from '../metadata/Types.js';

import { ModelFactory } from './ModelFactory.js';

test('rigid-object', async () => {
    // Arrange
    const type = Types.object({
        num: Types.prop(Types.number()),
        str: Types.prop(Types.string()),
    });

    const value: ValueTypeFromZodType<typeof type> = {
        num: 1,
        str: 'banana',
    };

    const model = await ModelFactory.createModel({ value, type });

    // Act
    const updated = await model.setProperty('num', 2);

    // Assert
    expect(updated.value).toStrictEqual({ num: 2, str: 'banana' });
});
