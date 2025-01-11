import { type } from 'arktype';

import { ModelFactory } from './ModelFactory.js';

test('map-object', async () => {
    const schema = type({ '[string]': type.number });

    const value: type.infer<typeof schema> = {
        a: 1,
        b: 2,
    };

    const model = await ModelFactory.createModel({ value, schema: schema });

    const updated1 = await model.setProperty('c', 3);

    expect(updated1.value).toStrictEqual({ a: 1, b: 2, c: 3 });

    const dModel = await ModelFactory.createModel({
        value: 4,
        schema: type.number,
    });
    const updated2 = await model.setProperty('c', dModel);

    expect(updated2.value).toStrictEqual({ a: 1, b: 2, d: 4 });

    await expect(async () => {
        // Try to set something invalid
        await model.unknownSetProperty('c', 'test');
    }).rejects.toThrow();
});

test('rigid-object', async () => {
    // Arrange
    const schema = type({
        num: type.number,
        str: type.string,
    });

    const value: type.infer<typeof schema> = {
        num: 1,
        str: 'banana',
    };

    const model = await ModelFactory.createModel({ value, schema: schema });

    // Act
    const updated = await model.setProperty('num', 2);

    // Assert
    expect(updated.value).toStrictEqual({ num: 2, str: 'banana' });
});
