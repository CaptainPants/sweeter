import { z } from 'zod';
import { type ValueTypeFromArkType } from '../types.js';

import { ModelFactory } from './ModelFactory.js';

test('map-object', async () => {
    const type = z.object({}).catchall(z.number());

    const value: z.infer<typeof type> = {
        a: 1,
        b: 2,
    };

    const model = await ModelFactory.createModel({ value, schema: type });

    const updated = await model.setProperty('c', 3);

    expect(updated.value).toStrictEqual({ a: 1, b: 2, c: 3 });
});
