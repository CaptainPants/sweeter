import { isCalculationRunning } from './internal/calculationDeferral.js';
import { type Signal } from './types.js';

export type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

let _ambientUsageListener: AmbientSignalUsageListener | undefined;
let _ambientChangesBlocked: boolean = false;

export function announceSignalUsage(signal: Signal<unknown>): void {
    _ambientUsageListener?.(signal);
}

export function untrack<T>(callback: () => T): T {
    return callAndInvokeListenerForEachDependency(callback, () => {}, false);
}

export function trackingIsAnError<T>(callback: () => T): T {
    return callAndInvokeListenerForEachDependency(
        callback,
        (signal) => {
            throw new Error(
                `Tracking is blocked here, meaning you have probably inadvertantly used .value when you should use .peek().`,
            );
        },
        false,
    );
}

export function announceMutatingSignal(signal: Signal<unknown>) {
    if (_ambientChangesBlocked) {
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
    const saved_ambientChangesBlocked = _ambientChangesBlocked;

    // Replace
    _ambientUsageListener = listener;
    _ambientChangesBlocked = readonly;

    try {
        return callback();
    } finally {
        // Restore
        _ambientUsageListener = saved_ambientUsageListener;
        _ambientChangesBlocked = saved_ambientChangesBlocked;
    }
}
