import { $mutable } from './$mutable.js';
import { $propertyOf } from './$propertyOf.js';

interface Example {
    prop: number;
}

it('$propertyOf mutations are visible on original object', () => {
    const signal = $mutable<Example>({ prop: 1 });

    expect(signal.value).toStrictEqual({ prop: 1 });

    const derived = $propertyOf(signal, 'prop');

    expect(derived.value).toStrictEqual(1);

    derived.value = 25;

    expect(derived.value).toStrictEqual(25);
    expect(signal.value).toStrictEqual({ prop: 25 });
});
