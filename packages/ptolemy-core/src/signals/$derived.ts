import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';
import { MutableDerivedSignal } from './internal/Signal-implementations/MutableDerivedSignal.js';
import {
    type DerivedSignalOptions,
    ReadWriteSignal,
    type Signal,
} from './types.js';

export type DerivationCallback<T> = (trigger: Signal<unknown> | undefined) => T;

export function $derived<T>(
    derivationCallback: DerivationCallback<T>,
    options?: DerivedSignalOptions,
): Signal<T>;
export function $derived<T>(
    derivationCallback: DerivationCallback<T>,
    mutate: (newValue: T) => void,
    options?: DerivedSignalOptions,
): ReadWriteSignal<T>;
export function $derived<T>(
    derivationCallback: DerivationCallback<T>,
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
