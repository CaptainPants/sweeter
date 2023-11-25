let calculationCount = 0;

let callbacks: (() => void)[] = [];

export function isCalculationRunning() {
    return calculationCount > 0;
}

export function startCalculation() {
    ++calculationCount;
}

export function finishCalculation() {
    --calculationCount;

    if (calculationCount === 0 && callbacks.length > 0) {
        const old = callbacks;
        callbacks = [];

        for (const callback of old) {
            try {
                callback();
            } catch (ex) {
                console.warn(
                    'Error swallowed while invoking callback',
                    callback,
                    ex,
                );
            }
        }
    }
}

export function afterCalculationComplete(callback: () => void) {
    if (isCalculationRunning()) {
        callbacks.push(callback);
        return;
    }

    try {
        callback();
    } catch (ex) {
        console.warn('Error swallowed while invoking callback', callback, ex);
    }
}
