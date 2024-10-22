import { type ValueTypeFromZodType } from '../types.js';
import { Types } from '../metadata/Types.js';

import { asRigidObject, asUnknown, cast } from './as.js';
import { ModelFactory } from './ModelFactory.js';

test('union', async () => {
    const a = Types.object({
        type: Types.prop(Types.constant('hasNumber')),
        number: Types.prop(Types.number()),
    });

    const b = Types.object({
        type: Types.prop(Types.constant('hasString')),
        string: Types.prop(Types.string()),
    });

    const c = Types.number();

    const type = Types.union(a, b, c);

    const value: ValueTypeFromZodType<typeof type> = {
        type: 'hasString',
        string: '$abc245',
    };

    const model = await ModelFactory.createModel({ value, type });

    expect(model.as(a)).toBeNull();
    expect(model.as(b)).not.toBeNull();

    const recursiveResolved = model.getRecursivelyResolved();

    const resolvedAsUnknown = asUnknown(recursiveResolved);

    const casted = cast(resolvedAsUnknown, asRigidObject);

    expect(casted).not.toBeUndefined();
});
