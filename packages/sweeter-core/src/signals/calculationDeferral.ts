import { dev } from '../dev';

let calculationCount = 0;
let runningCallbacks = false;

let callbacks: (() => void)[] = [];

export function isCalculationRunning() {
    return calculationCount > 0;
}

export function startCalculation() {
    ++calculationCount;
}

export function finishCalculation() {
    --calculationCount;

    // We might have called startCalculation within one of these callbacks, so make sure if we're already processing the list
    // we don't start again..
    if (runningCallbacks) {
        return;
    }

    if (calculationCount === 0 && callbacks.length > 0) {
        // Iterate with i so that if we add callbacks on later
        runningCallbacks = true;
        try {
            for (let i = 0; i < callbacks.length; ++i) {
                const callback = callbacks[i];
                try {
                    callback!();
                } catch (ex) {
                    dev.swallowedError(
                        'Error swallowed while invoking callback',
                        ex,
                        callback,
                    );
                }
            }
        } finally {
            runningCallbacks = false;
            callbacks = [];
        }
    }
}

/**
 * Call the parameter callback after any running calculations are complete.
 * @param callback
 * @returns
 */
export function afterCalculationsComplete(callback: () => void) {
    if (runningCallbacks || isCalculationRunning()) {
        callbacks.push(callback);
        return;
    }

    try {
        callback();
    } catch (ex) {
        console.warn('Error swallowed while invoking callback', callback, ex);
    }
}
