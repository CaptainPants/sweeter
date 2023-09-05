import { Signal } from ".";

import '../internal/polyfill.js';

export type AmbientSignalUsageListener<T> = (signal: Signal<T>) => void;

const listenerStack: AmbientSignalUsageListener<unknown>[] = [];

export function listen(listener: AmbientSignalUsageListener<unknown>): Disposable & { readonly listener: AmbientSignalUsageListener<unknown> } {
    // This is just for giving useful error checks
    const previousTop = listenerStack[listenerStack.length - 1];

    listenerStack.push(listener);

    return {
        listener,
        [Symbol.dispose]() {
            const afterPopTop = listenerStack[listenerStack.length - 1];

            listenerStack.pop();

            if (afterPopTop !== previousTop) {
                throw new Error('Unexpected top element on listener stack, this probably indicates a missing dispose or out of order disposal.');
            }
        }
    }
}