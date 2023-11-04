import { isSignal } from './isSignal.js';
import { popAndCall } from '../internal/popAndCall.js';
import { valueOf } from './valueOf.js';
import type { UnsignalAll } from './types.js';

/**
 * Subscribe to multiple signals, with a callback to remove that subscription.
 * @param dependencies A list of signals, for which when any change the callback will be invoked. For convenience when using with props, values other than signals will be ignored.
 * @param callback
 * @returns
 */
export function subscribeToChanges<TArgs extends readonly unknown[]>(
    dependencies: TArgs,
    callback: (values: UnsignalAll<TArgs>) => void | (() => void),
    invokeImmediate = false,
): () => void {
    let lastCleanup: void | (() => void);

    const innerCallback = () => {
        if (lastCleanup) {
            lastCleanup?.();
        }

        // callback can return a cleanup method to be called next change.
        lastCleanup = callback(
            dependencies.map((x) => valueOf(x)) as UnsignalAll<TArgs>,
        );
    };

    const cleanupList: (() => void)[] = [];

    try {
        for (const item of dependencies) {
            if (isSignal(item)) {
                cleanupList.push(item.listen(innerCallback));
            }
        }
    } catch (ex) {
        popAndCall(cleanupList);
        throw ex;
    }

    if (invokeImmediate) {
        innerCallback();
    }

    return () => {
        popAndCall(cleanupList);
    };
}
