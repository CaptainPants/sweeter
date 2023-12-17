

import { Types } from '../types/Types.js';

import { isModel } from './isModel.js';
import { ModelFactory } from './ModelFactory.js';

test('isModel should be true for an example model', async () => {
    const numberModel = await ModelFactory.createModel({
        value: 12,
        type: Types.number(),
    });
    expect(isModel(numberModel)).toStrictEqual(true);
});

test('isModel should be false for arbitrary values', async () => {
    expect(isModel(1)).toStrictEqual(false);
    expect(isModel({ test: 1 })).toStrictEqual(false);
});
