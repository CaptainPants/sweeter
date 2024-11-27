import { type } from 'arktype';

import { ModelFactory } from './ModelFactory.js';

test('map-object', async () => {
    const schema = type({ '[string]': type.number });

    const a1 = type({ '[string]': type.number });

    const value: type.infer<typeof schema> = {
        a: 1,
        b: 2,
    };

    const model = await ModelFactory.createModel({ value, schema: schema });

    const updated = await model.setProperty('c', 3);

    expect(updated.value).toStrictEqual({ a: 1, b: 2, c: 3 });

    expect(async () => {
        await model.unknownSetProperty('c', 'test');
    }).toThrow();
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
