import {
    CalculatedSignal,
    MutableCalculatedSignal,
} from './internal/Signal-implementations.js';
import { isReadWriteSignal } from './isSignal.js';
import { type Signal, type ReadWriteSignal } from './types.js';

/**
 * Create a new signal pointing to an array element of an existing signal.
 *
 * If the source signal was mutable, and readonly = false, then changes are propogated back to the source signal.
 * @param source
 * @param keyOrIndex
 * @param readonly The derived signal must be readonly - Defaults to false
 */
export function $element<
    TSource extends readonly unknown[],
    TKeyOrIndex extends keyof TSource & number,
>(
    source: ReadWriteSignal<TSource>,
    keyOrIndex: TKeyOrIndex,
    /**
     * @default false
     */
    readonly?: boolean,
): ReadWriteSignal<TSource[TKeyOrIndex]> & { value: TSource[TKeyOrIndex] };

/**
 * Create a new signal pointing to an array element of an existing signal.
 *
 * If the source signal was mutable, and readonly = false, then changes are propogated back to the source signal.
 * @param source
 * @param keyOrIndex
 * @param readonly The derived signal must be readonly - Defaults to false
 */
export function $element<
    TSource extends readonly unknown[],
    TKey extends keyof TSource & number,
>(
    source: Signal<TSource>,
    keyOrIndex: TKey,
    /**
     * @default false
     */
    readonly?: boolean,
): Signal<TSource[TKey]> & { value: TSource[TKey] };

export function $element<
    TSource extends readonly unknown[],
    TKeyOrIndex extends keyof TSource,
>(
    source: Signal<TSource>,
    key: TKeyOrIndex,
    readonly: boolean = false,
): Signal<unknown> {
    if (isReadWriteSignal(source) && !readonly) {
        return new MutableCalculatedSignal<TSource[TKeyOrIndex]>(
            () => source.value[key],
            (value) => {
                const sourceValue = source.value;

                if (typeof key !== 'number')
                    throw new TypeError('Key must be a number.');
                if (!Array.isArray(sourceValue))
                    throw new TypeError('Key must be a number.');

                const copy = [...sourceValue] as unknown as TSource;
                copy[key as TKeyOrIndex] = value;
                source.update(copy);
            },
        );
    } else {
        return new CalculatedSignal<TSource[TKeyOrIndex]>(
            () => source.value[key],
        );
    }
}
