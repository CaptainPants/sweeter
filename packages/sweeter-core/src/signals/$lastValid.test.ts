import { $mutable } from './$mutable.js'
import { $lastValid } from './$lastValid.js';

it('General', () => {
    const throws = $mutable(false);
    const result = $mutable('alpha');

    const signal = $lastValid(() => {
        if (throws.value) {
            throw new Error('Throws');
        }
        return result.value;
    });

    expect(signal.peek()).toStrictEqual("alpha");

    throws.value = true; // the calculation is now throwing each time, so returns 'alpha' as the most recent valid value
    result.value = 'beta';

    expect(signal.peek()).toStrictEqual("alpha");

    throws.value = false;

    expect(signal.peek()).toStrictEqual("beta");
});
