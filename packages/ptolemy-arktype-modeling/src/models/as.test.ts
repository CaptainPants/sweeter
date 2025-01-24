import { type } from 'arktype';

import { asBoolean, asNumber } from './as.js';
import { ModelFactory } from './ModelFactory.js';

test('boolean', async () => {
    const example1 = await ModelFactory.createModel({
        value: true,
        schema: type.boolean,
    });
    const example2 = await ModelFactory.createModel({
        value: true,
        schema: type.unit(true).or(type.unit(false)),
    });

    expect(asBoolean(example1)).not.toStrictEqual(undefined);
    expect(asBoolean(example2)).not.toStrictEqual(undefined);

    expect(asNumber(example1)).toStrictEqual(undefined);
});
