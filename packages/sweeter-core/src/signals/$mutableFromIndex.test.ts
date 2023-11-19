import { $mutable } from './$mutable.js';
import { $mutableFromIndex } from './$mutableFromIndex.js';

it('$mutableFromIndex mutations are visible on original object', () => {
    const signal = $mutable({ prop: 1 });

    expect(signal.value).toStrictEqual({ prop: 1 });

    const calculated = $mutableFromIndex(signal, 'prop');

    expect(calculated.value).toStrictEqual(1);

    calculated.value = 25;

    expect(calculated.value).toStrictEqual(25);
    expect(signal.value).toStrictEqual({ prop: 25 });
});
