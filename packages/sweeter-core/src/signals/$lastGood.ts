import { type CalculatedSignalOptions, type Signal } from './types.js';
import { CalculatedSignal } from './internal/Signal-implementations.js';

const noLastValidValue = Symbol('notSet');

/**
 * Similar to $calc. The signal resulting from calling this function will keep track of the most recent 'good' value, and if the calculation starts throwing errors, will return the last good value. If the first time the calculation throws, then
 * $lastGood will throw - this is intentional and prevents a case where there is no 'last good' value.
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
        } catch (err) {
            if (lastValid === noLastValidValue) {
                throw err;
            }

            return lastValid;
        }
    };
    const result = new CalculatedSignal(inner, options);

    // Force the $calc to initialize, and throw if its an exception
    // this prevents a case where there is no 'last good' value and
    // therefore you can trust that a $lastGood signal once created
    // will always have a value and not throw.
    result.peek();

    return result;
}
