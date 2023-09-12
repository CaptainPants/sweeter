import { Signal } from '.';

import '../internal/polyfill.js';

type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

let ambientUsageListener: AmbientSignalUsageListener | undefined;

export function announceSignalUsage(signal: Signal<unknown>): void {
    ambientUsageListener?.(signal);
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
    const saved = ambientUsageListener;
    ambientUsageListener = listener;
    try {
        return callback();
    } finally {
        ambientUsageListener = saved;
    }
}
