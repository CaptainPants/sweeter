import type { Signal } from './types.js';

type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

let _ambientUsageListener: AmbientSignalUsageListener | undefined;
let _ambientListenerExpectsReadonly: boolean = false;

export function announceSignalUsage(signal: Signal<unknown>): void {
    _ambientUsageListener?.(signal);
}

export function untrack(callback: () => void): void {
    callAndInvokeListenerForEachDependency(callback, () => {}, false);
}

export function announceMutatingSignal(signal: Signal<unknown>) {
    if (_ambientListenerExpectsReadonly) {
        throw new TypeError(
            'Mutating a signal inside a CalculatedSignal is not allowed.',
        );
    }
}

export function callAndReturnDependencies<T>(
    callback: () => T,
    readonly: boolean,
): {
    result: T;
    dependencies: Set<Signal<unknown>>;
} {
    const dependencies = new Set<Signal<unknown>>();

    const listener = (signal: Signal<unknown>) => {
        dependencies.add(signal);
    };

    const result = callAndInvokeListenerForEachDependency(
        callback,
        listener,
        readonly,
    );

    return { result, dependencies };
}

export function callAndInvokeListenerForEachDependency<T>(
    callback: () => T,
    listener: AmbientSignalUsageListener,
    readonly: boolean,
): T {
    // Save
    const saved_ambientUsageListener = _ambientUsageListener;
    const saved_ambientListenerExpectsReadonly =
        _ambientListenerExpectsReadonly;

    // Replace
    _ambientUsageListener = listener;
    _ambientListenerExpectsReadonly = readonly;

    try {
        return callback();
    } finally {
        // Restore
        _ambientUsageListener = saved_ambientUsageListener;
        _ambientListenerExpectsReadonly = saved_ambientListenerExpectsReadonly;
    }
}
