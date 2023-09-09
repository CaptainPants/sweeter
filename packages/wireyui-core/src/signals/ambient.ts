import { Signal } from '.';

import '../internal/polyfill.js';

type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

const listenerStack: AmbientSignalUsageListener[] = [];

export function listenForSignalUsage<T>(
    callback: () => T
): { result: T, dependencies: Set<Signal<unknown>> } {
    // This is just for giving useful error checks
    const previousTop = listenerStack[listenerStack.length - 1];

    const dependencies = new Set<Signal<unknown>>;

    const listener = (signal: Signal<unknown>) => {
        dependencies.add(signal);
    }

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

    return {
        result,
        dependencies
    }
}
