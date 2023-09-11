import { Signal } from '.';

import '../internal/polyfill.js';

type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

const listenerStack: AmbientSignalUsageListener[] = [];

export function announceSignalUsage(signal: Signal<unknown>): void {
    listenerStack[listenerStack.length - 1]?.(signal);
}

export function untrack(callback: () => void): void {
    callAndInvokeListenerForEachDependency(callback, () => {});
}

export function callAndReturnDependencies<T>(callback: () => T): {
    result: T;
    dependencies: Set<Signal<unknown>>;
} {
    const dependencies = new Set<Signal<unknown>>();

    const listener = (signal: Signal<unknown>) => {
        dependencies.add(signal);
    };

    const result = callAndInvokeListenerForEachDependency(callback, listener);

    return { result, dependencies };
}

export function callAndInvokeListenerForEachDependency<T>(
    callback: () => T,
    listener: AmbientSignalUsageListener,
): T {
    listenerStack.push(listener);

    using _ = {
        [Symbol.dispose]() {
            const removed = listenerStack.pop();

            if (removed !== listener) {
                throw new Error(
                    'Unexpected top element on listener stack, this probably indicates a missing dispose or out of order disposal.',
                );
            }
        },
    };

    const result = callback();

    return result;
}
