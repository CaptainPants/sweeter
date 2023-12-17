import { Types } from '../types/index.js';

import { asBoolean, asNumber } from './as.js';
import { ModelFactory } from './ModelFactory.js';

test('boolean', async () => {
    const example1 = await ModelFactory.createModel({
        value: true,
        type: Types.boolean(),
    });
    const example2 = await ModelFactory.createModel({
        value: true,
        type: Types.union(Types.true(), Types.false()),
    });

    expect(asBoolean(example1)).not.toStrictEqual(undefined);
    expect(asBoolean(example2)).not.toStrictEqual(undefined);

    expect(asNumber(example1)).toStrictEqual(undefined);
});
