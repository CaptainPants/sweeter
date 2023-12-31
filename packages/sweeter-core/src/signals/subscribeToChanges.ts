import { isSignal } from './isSignal.js';
import { $valEach } from './$val.js';
import { type UnsignalAll } from './types.js';
import { popAndCallAll } from '../internal/popAndCallAll.js';

/**
 * Subscribe to multiple signals, with a callback to remove that subscription.
 * @param dependencies A list of signals, for which when any change the callback will be invoked. For convenience when using with props, values other than signals will be ignored.
 * @param callback
 * @param invokeImmediate
 * @returns
 */
export function subscribeToChanges<TArgs extends readonly unknown[]>(
    // the [...TArgs] causes inference as a tuple more often (although not for literal types)
    dependencies: [...TArgs],
    callback: (values: UnsignalAll<TArgs>) => void | (() => void),
    invokeImmediate = false,
): () => void {
    let lastCleanup: void | (() => void);

    const innerCallback = () => {
        if (lastCleanup) {
            lastCleanup?.();
        }

        // callback can return a cleanup method to be called next change.
        lastCleanup = callback($valEach(dependencies));
    };

    const unlisten: (() => void)[] = [];

    try {
        for (const item of dependencies) {
            if (isSignal(item)) {
                // Note that this is a strong reference, we need to be careful to unsubscribe later
                unlisten.push(item.listen(innerCallback, true));
            }
        }
    } catch (ex) {
        popAndCallAll(unlisten);
        throw ex;
    }

    if (invokeImmediate) {
        innerCallback();
    }

    return () => {
        popAndCallAll(unlisten);
        lastCleanup?.();
    };
}
