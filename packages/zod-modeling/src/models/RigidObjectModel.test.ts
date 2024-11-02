import { z } from 'zod';
import { type ValueTypeFromArkType } from '../types.js';

import { ModelFactory } from './ModelFactory.js';

test('rigid-object', async () => {
    // Arrange
    const type = z.object({
        num: z.number(),
        str: z.string(),
    });

    const value: ValueTypeFromArkType<typeof type> = {
        num: 1,
        str: 'banana',
    };

    const model = await ModelFactory.createModel({ value, type });

    // Act
    const updated = await model.setProperty('num', 2);

    // Assert
    expect(updated.value).toStrictEqual({ num: 2, str: 'banana' });
});
