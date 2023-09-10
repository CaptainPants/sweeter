import { Signal } from '.';

import '../internal/polyfill.js';

type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

const listenerStack: AmbientSignalUsageListener[] = [];

export function announceSignalUsage(signal: Signal<unknown>): void {
    listenerStack[listenerStack.length - 1]?.(signal);
}

export function untrack(callback: () => void): void {
    callForSignalUsage(callback, () => {});
}

export function collectSignalUsage<T>(callback: () => T): {
    result: T;
    dependencies: Set<Signal<unknown>>;
} {
    const dependencies = new Set<Signal<unknown>>();

    const listener = (signal: Signal<unknown>) => {
        dependencies.add(signal);
    };

    const result = callForSignalUsage(callback, listener);

    return { result, dependencies };
}

export function callForSignalUsage<T>(
    callback: () => T,
    listener: AmbientSignalUsageListener,
): T {
    // This is just for giving useful error checks
    const previousTop = listenerStack[listenerStack.length - 1];

    listenerStack.push(listener);

    using _ = {
        [Symbol.dispose]() {
            const afterPopTop = listenerStack[listenerStack.length - 1];

            listenerStack.pop();

            if (afterPopTop !== previousTop) {
                throw new Error(
                    'Unexpected top element on listener stack, this probably indicates a missing dispose or out of order disposal.',
                );
            }
        },
    };

    const result = callback();

    return result;
}
