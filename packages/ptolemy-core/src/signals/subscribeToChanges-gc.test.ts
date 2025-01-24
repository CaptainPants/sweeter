import { $mutable } from './$mutable.js';
import { subscribeToChanges } from './subscribeToChanges.js';

it('Subscription cleaned up when callback is GC-d', async () => {
    const signal = $mutable(1);

    let counter = 0;

    let callback: ((val: [number]) => void) | undefined = ([_val]) => {
        ++counter;
    };

    subscribeToChanges(
        [signal],
        callback,
        /* INVOKE IMMEDIATELY */ false,
        /* STRONG */ false,
    );

    signal.value = signal.peek() + 1;

    expect(counter).toStrictEqual(1);

    callback = undefined; // Make callback unreachable, will make it available for GC (along with the inner handler callback)

    await global.gc!({ execution: 'async', type: 'major' });

    signal.value = signal.peek() + 1; // This should not trigger the callback

    expect(counter).toStrictEqual(1);
});
