import { $mutable } from './MutableValueSignal.js';
import { $deferred } from './DeferredSignal.js';

it('DeferredSignal updated after microtask (default deferral mechanism)', async () => {
    const mutable = $mutable(1);
    const deferred = $deferred(mutable);

    expect(deferred.value).toBe(1);

    mutable.value = 2;

    expect(deferred.value).toBe(1);

    await new Promise<void>((resolve) => queueMicrotask(() => resolve()));

    expect(deferred.value).toBe(2);
});

it('DeferredSignal updated later (alternate deferral callback)', () => {
    const queue: (() => void)[] = [];

    const mutable = $mutable(1);
    const deferred = $deferred(mutable, (callback) => queue.push(callback));

    expect(deferred.value).toBe(1);

    mutable.value = 2;

    expect(deferred.value).toBe(1);

    queue.forEach((x) => x());

    expect(deferred.value).toBe(2);
});
