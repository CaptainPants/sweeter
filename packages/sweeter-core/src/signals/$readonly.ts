import { type Signal } from './types.js';
import { isReadWriteSignal } from './isSignal.js';
import { $derive } from './$derive.js';
import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';

/**
 * Returns a read only promise linked to the source signal.
 * @param source
 * @returns
 */
export function $readonly<T>(source: Signal<T>) {
    if (!isReadWriteSignal(source)) {
        return source;
    }

    const readonlyCalculation = () => source.value;
    return new DerivedSignal(readonlyCalculation);
}
