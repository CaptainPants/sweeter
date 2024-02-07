import { type CalculatedSignalOptions, type Signal } from './types.js';
import { CalculatedSignal } from './internal/Signal-implementations.js';

const noLastValidValue = Symbol('notSet');

/**
 * Similar to $calc. The signal resulting from calling this function will keep track of the most recent 'good' value, and if the calculation starts throwing errors, will return the last good value.
 * @param calculation 
 * @param options 
 * @returns 
 */
export function $lastGood<T>(
    calculation: () => T,
    options?: CalculatedSignalOptions,
): Signal<T> {
    let lastValid: typeof noLastValidValue | T = noLastValidValue;

    const inner = () => {
        try {
            lastValid = calculation();
            return lastValid;
        }
        catch (err) {
            if (lastValid === noLastValidValue) {
                throw err;
            }

            return lastValid;
        }
    }
    const result = new CalculatedSignal(inner, options);
    result.peek(); // Force the $calc to initialize, and throw if its an exception
    return result;
}