import { CalculatedSignal } from './CalculatedSignal.js';
import { announceMutatingSignal, announceSignalUsage } from './ambient.js';
import { writableSignalMarker } from './internal/markers.js';
import type { ReadWriteSignal } from './types.js';

export class MutableCalculatedSignal<T>
    extends CalculatedSignal<T>
    implements ReadWriteSignal<T>
{
    constructor(calculation: () => T, mutate: (value: T) => void) {
        super(calculation);

        this.#mutate = mutate;
    }

    #mutate: (value: T) => void;

    override get value(): T {
        // Weirdly, if you don't override the getter as well you end up with an undefined result
        // so this just duplicates the code in SignalBase.value
        announceSignalUsage(this);
        return this.peek();
    }

    override set value(value: T) {
        announceMutatingSignal(this);
        this.#mutate(value);
    }

    update(value: T): void {
        this.value = value;
    }

    readonly [writableSignalMarker] = true;
}

export function $mutableCalc<T>(
    calculation: () => T,
    mutate: (value: T) => void,
): MutableCalculatedSignal<T> {
    return new MutableCalculatedSignal<T>(calculation, mutate);
}

export function $derived<TSource, TKey extends keyof TSource>(
    source: ReadWriteSignal<TSource>,
    key: TKey,
): MutableCalculatedSignal<TSource[TKey]> {
    return new MutableCalculatedSignal<TSource[TKey]>(
        () => source.value[key],
        (value) => {
            const sourceObjectOriginal = source.value;

            if (Array.isArray(sourceObjectOriginal)) {
                if (typeof key !== 'number')
                    throw new TypeError(
                        'If source is an array, key must be a number.',
                    );

                const copy = [...sourceObjectOriginal] as TSource;
                copy[key as TKey] = value;
                source.update(copy);
            } else if (
                typeof sourceObjectOriginal === 'object' &&
                sourceObjectOriginal !== null
            ) {
                const copy = { ...sourceObjectOriginal } as TSource;
                copy[key] = value;
                source.update(copy);
            } else {
                throw new TypeError(
                    `Unexpected type ${typeof sourceObjectOriginal}`,
                );
            }
        },
    );
}