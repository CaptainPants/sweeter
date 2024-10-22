import { Types } from '../metadata/Types.js';

import { ModelFactory } from './ModelFactory.js';

test('array', async () => {
    const type = Types.array(Types.number());

    const input = [1, 2, 3];

    const model = await ModelFactory.createModel({
        value: input,
        type,
        parentInfo: null,
    });

    const result = await model.spliceElements(1, 0, [6, 7]);

    expect(input).toStrictEqual([1, 2, 3]);
    expect(result.value).toStrictEqual([1, 6, 7, 2, 3]);
});
