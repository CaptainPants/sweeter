import { derived, mutableCalc } from './MutableCalculatedSignal.js';
import { mutable } from './MutableValueSignal.js';

it('mutableCalc mutations are visible on original object', () => {
    const signal = mutable({ prop: 1 });

    expect(signal.value).toStrictEqual({ prop: 1 });

    const calculated = mutableCalc(
        () => signal.value.prop,
        (value) => (signal.value = { prop: value }),
    );

    expect(calculated.value).toStrictEqual(1);

    calculated.value = 25;

    expect(calculated.value).toStrictEqual(25);
    expect(signal.value).toStrictEqual({ prop: 25 });
});

it('derived mutations are visible on original object', () => {
    const signal = mutable({ prop: 1 });

    expect(signal.value).toStrictEqual({ prop: 1 });

    const calculated = derived(signal, 'prop');

    expect(calculated.value).toStrictEqual(1);

    calculated.value = 25;

    expect(calculated.value).toStrictEqual(25);
    expect(signal.value).toStrictEqual({ prop: 25 });
});
