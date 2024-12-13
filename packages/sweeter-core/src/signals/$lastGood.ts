import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';
import { type DerivedSignalOptions, type Signal } from './types.js';

const noLastValidValue = Symbol('notSet');

/**
 * Similar to $derive. The signal resulting from calling this function will keep track of the most recent 'good' value, and if the calculation starts throwing errors, will return the last good value. If the first time the calculation throws, then
 * $lastGood will throw - this is intentional and prevents a case where there is no 'last good' value.
 * @param derivationCallback
 * @param options
 * @returns
 */
export function $lastGood<T>(
    derivationCallback: () => T,
    options?: DerivedSignalOptions,
): Signal<T> {
    let lastValid: typeof noLastValidValue | T = noLastValidValue;

    const inner = () => {
        try {
            lastValid = derivationCallback();
            return lastValid;
        } catch (err) {
            if (lastValid === noLastValidValue) {
                throw err;
            }

            return lastValid;
        }
    };
    const result = new DerivedSignal(inner, options);

    // Force the $derive to initialize, and throw if its an exception
    // this prevents a case where there is no 'last good' value and
    // therefore you can trust that a $lastGood signal once created
    // will always have a value and not throw.
    result.peek();

    return result;
}
