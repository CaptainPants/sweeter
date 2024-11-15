import { z } from 'zod';
import { type ValueTypeFromArkType } from '../types.js';

import { asObject, asUnknown, cast } from './as.js';
import { ModelFactory } from './ModelFactory.js';

test('union', async () => {
    const a = z.object({
        type: z.literal('hasNumber'),
        number: z.number(),
    });

    const b = z.object({
        type: z.literal('hasString'),
        string: z.string(),
    });

    const c = z.number();

    const type = z.union([a, b, c]);

    const value: z.infer<typeof type> = {
        type: 'hasString',
        string: '$abc245',
    };

    const model = await ModelFactory.createModel({ value, arkType: type });

    expect(model.as(a)).toBeNull();
    expect(model.as(b)).not.toBeNull();
});
