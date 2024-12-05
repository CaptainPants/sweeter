import { type } from 'arktype';

import { ModelFactory } from './ModelFactory.js';

test('union', async () => {
    const a = type({
        type: type.unit('hasNumber'),
        number: type.number,
    });

    const b = type({
        type: type.unit('hasString'),
        string: type.string,
    });

    const c = type.number;

    const schema = a.or(b).or(c);

    const value: type.infer<typeof schema> = {
        type: 'hasString',
        string: '$abc245',
    };

    const model = await ModelFactory.createModel({ value, schema: schema });

    expect(model.as(a)).toBeNull();
    expect(model.as(b)).not.toBeNull();
});
