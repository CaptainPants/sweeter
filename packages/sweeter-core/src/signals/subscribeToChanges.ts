import { isSignal } from './isSignal.js';
import { $valElements } from './$val.js';
import { type UnsignalAll } from './types.js';
import { popAndCallAll } from '../internal/popAndCallAll.js';
import {
    addExplicitStrongReference,
    removeExplicitStrongReference,
} from '@captainpants/sweeter-utilities';

/**
 * Subscribe to multiple signals, with a callback to remove that subscription.
 * @param dependencies A list of signals, for which when any change the callback will be invoked. For convenience when using with props, values other than signals will be ignored.
 * @param callback
 * @param invokeImmediate
 * @param strong
 * @returns
 */
export function subscribeToChanges<TArgs extends readonly unknown[]>(
    // the [...TArgs] causes inference as a tuple more often (although not for literal types)
    dependencies: [...TArgs],
    /**
     * The subscription will be dropped if this callback is garbage collected -- TODO: not sure .. why
     */
    callback: (values: UnsignalAll<TArgs>) => void | (() => void),
    invokeImmediate = false,
    /**
     * Whether or not the callback should be registered via WeakRef from dependent signals.
     */
    strong = true,
): () => void {
    let lastCleanup: void | (() => void);

    // The lifetime of this method has to be at minimum as long as callback,
    // so we add an explicit reference between them.
    const innerCallback = () => {
        if (lastCleanup) {
            lastCleanup?.();
        }

        // callback can return a cleanup method to be called next change.
        lastCleanup = callback($valElements(dependencies));
    };
    addExplicitStrongReference(callback, innerCallback);

    const unlisten: (() => void)[] = [];

    try {
        for (const item of dependencies) {
            if (isSignal(item)) {
                // Note that this is a strong reference, we need to be careful to unsubscribe later
                unlisten.push(
                    strong
                        ? item.listen(innerCallback)
                        : item.listenWeak(innerCallback),
                );
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

        removeExplicitStrongReference(callback, innerCallback);
    };
}
