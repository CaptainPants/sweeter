import { isCalculationRunning } from './internal/calculationDeferral.js';
import { type Signal } from './types.js';

export type AmbientSignalUsageListener = (signal: Signal<unknown>) => void;

let _ambientUsageListener: AmbientSignalUsageListener | undefined;

export function announceSignalUsage(signal: Signal<unknown>): void {
    _ambientUsageListener?.(signal);
}

export function untrack<T>(callback: () => T): T {
    return callAndInvokeListenerForEachDependency(callback, () => {});
}

export function trackingIsAnError<T>(callback: () => T): T {
    return callAndInvokeListenerForEachDependency(callback, (signal) => {
        throw new Error(
            `Tracking is blocked here, meaning you have probably inadvertantly used .value when you should use .peek().`,
        );
    });
}

export function announceMutatingSignal(signal: Signal<unknown>) {
    if (isCalculationRunning()) {
        throw new TypeError(
            'Mutating a signal inside a CalculatedSignal is not allowed.',
        );
    }
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
    // Save
    const saved_ambientUsageListener = _ambientUsageListener;

    // Replace
    _ambientUsageListener = listener;

    try {
        return callback();
    } finally {
        // Restore
        _ambientUsageListener = saved_ambientUsageListener;
    }
}
