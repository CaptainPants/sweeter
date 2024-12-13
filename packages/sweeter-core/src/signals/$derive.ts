import {
    ReadWriteSignal,
    type DerivedSignalOptions,
    type Signal,
} from './types.js';
import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';
import { MutableDerivedSignal } from './internal/Signal-implementations/MutableDerivedSignal.js';

export function $derive<T>(
    derivationCallback: () => T,
    options?: DerivedSignalOptions,
): Signal<T>;
export function $derive<T>(
    derivationCallback: () => T,
    mutate: (newValue: T) => void,
    options?: DerivedSignalOptions,
): ReadWriteSignal<T>;
export function $derive<T>(
    derivationCallback: () => T,
    optionsOrMutate: DerivedSignalOptions | undefined | ((newValue: T) => void),
    options?: DerivedSignalOptions,
): Signal<T> {
    if (typeof optionsOrMutate === 'function') {
        return new MutableDerivedSignal(
            derivationCallback,
            optionsOrMutate,
            options,
        );
    }

    return new DerivedSignal(derivationCallback, optionsOrMutate);
}
