import { waitFor } from '../test/waitFor.js';

import { whenGarbageCollected } from './whenGarbageCollected.js';

it('First attempt at garbage collection aware unit test', async () => {
    const collected = new AbortController();

    let thing: object | undefined = {};

    const weakRef = new WeakRef(thing);

    whenGarbageCollected(thing, () => {
        collected.abort();
    });

    await global.gc!({ execution: 'async', type: 'major' });

    expect(weakRef.deref()).not.toStrictEqual(undefined);
    expect(collected.signal.aborted).toStrictEqual(false);

    thing = undefined;

    await global.gc!({ execution: 'async', type: 'major' });

    const elapsed = await waitFor(collected.signal, 5000); // This is a little non-deterministic, so its tricky

    console.log(`Watched for ${elapsed}ms.`);

    expect(weakRef.deref()).toStrictEqual(undefined);
    expect(collected.signal.aborted).toStrictEqual(true);
});
