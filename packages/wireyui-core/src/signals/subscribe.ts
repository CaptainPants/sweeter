import { isSignal } from './isSignal.js';
import { popAndCall } from '../internal/popAndCall.js';

/**
 * Subscribe to multiple signals, with a callback to remove that subscription.
 * @param dependencies A list of signals, for which when any change the callback will be invoked. For convenience when using with props, values other than signals will be ignored.
 * @param callback
 * @returns
 */
export function subscribe(
    dependencies: readonly unknown[],
    callback: () => void,
): () => void {
    const cleanupList: (() => void)[] = [];

    try {
        for (const item of dependencies) {
            if (isSignal(item)) {
                cleanupList.push(item.listen(callback));
            }
        }
    } catch (ex) {
        popAndCall(cleanupList);
        throw ex;
    }

    return () => {
        popAndCall(cleanupList);
    };
}
