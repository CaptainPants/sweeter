import { $mutable } from "./MutableValueSignal.js";
import { $deferred } from "./DeferredSignal.js";

it('DeferredSignal updated later', () => {
    const queue: (() => void)[] = [];

    const mutable = $mutable(1);
    const deferred = $deferred(mutable, (callback) => queue.push(callback));

    expect(deferred.value).toBe(1);

    mutable.value = 2;

    expect(deferred.value).toBe(1);

    queue.forEach(x => x());

    expect(deferred.value).toBe(2);
});