import { type ValueTypeFromType } from '../types.js';
import { Types } from '../types/Types.js';

import { ModelFactory } from './ModelFactory.js';

test('map-object', async () => {
    const type = Types.map(Types.number());

    const value: ValueTypeFromType<typeof type> = {
        a: 1,
        b: 2,
    };

    const model = await ModelFactory.createModel({ value, type });

    const updated = await model.setPropertyValue('c', 3);

    expect(updated.value).toStrictEqual({ a: 1, b: 2, c: 3 });
});
