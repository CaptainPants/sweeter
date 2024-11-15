
import { type } from 'arktype';
import { ModelFactory } from './ModelFactory.js';

test('array', async () => {
    const arkType = type.number.array();

    const input = [1, 2, 3];

    const model = await ModelFactory.createModel({
        value: input,
        arkType: arkType,
        parentInfo: null,
    });

    const result = await model.spliceElements(1, 0, [6, 7]);

    expect(input).toStrictEqual([1, 2, 3]);
    expect(result.value).toStrictEqual([1, 6, 7, 2, 3]);
});
