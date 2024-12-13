import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';
import { MutableDerivedSignal } from './internal/Signal-implementations/MutableDerivedSignal.js';
import { isReadWriteSignal } from './isSignal.js';
import { type Signal, type ReadWriteSignal } from './types.js';

type ElementType<
    T extends readonly unknown[],
    TKey extends keyof T,
> = number extends T['length'] ? T[TKey] | undefined : T[TKey];

/**
 * Create a new signal pointing to an array element of an existing signal.
 *
 * If the source signal was mutable, and readonly = false, then changes are propogated back to the source signal.
 * @param source
 * @param keyOrIndex
 * @param readonly The derived signal must be readonly - Defaults to false
 */
export function $elementOf<
    TSource extends readonly unknown[],
    TKeyOrIndex extends keyof TSource,
>(
    source: ReadWriteSignal<TSource>,
    keyOrIndex: TKeyOrIndex,
    /**
     * @default false
     */
    readonly?: boolean,
): ReadWriteSignal<ElementType<TSource, TKeyOrIndex>> & {
    value: ElementType<TSource, TKeyOrIndex>;
};

/**
 * Create a new signal pointing to an array element of an existing signal.
 *
 * If the source signal was mutable, and readonly = false, then changes are propogated back to the source signal.
 * @param source
 * @param keyOrIndex
 * @param readonly The derived signal must be readonly - Defaults to false
 */
export function $elementOf<
    TSource extends readonly unknown[],
    TKeyOrIndex extends keyof TSource,
>(
    source: Signal<TSource>,
    keyOrIndex: TKeyOrIndex,
    /**
     * @default false
     */
    readonly?: boolean,
): Signal<ElementType<TSource, TKeyOrIndex>> & {
    value: ElementType<TSource, TKeyOrIndex>;
};

export function $elementOf<
    TSource extends readonly unknown[],
    TKeyOrIndex extends keyof TSource,
>(
    source: Signal<TSource>,
    key: TKeyOrIndex,
    readonly: boolean = false,
): Signal<unknown> {
    if (isReadWriteSignal(source) && !readonly) {
        return new MutableDerivedSignal<TSource[TKeyOrIndex]>(
            () => source.value[key],
            (value) => {
                const sourceValue = source.value;

                if (typeof key !== 'number')
                    throw new TypeError('Key must be a number.');
                if (!Array.isArray(sourceValue))
                    throw new TypeError('Key must be a number.');

                const copy = [...sourceValue] as unknown as TSource;
                copy[key as TKeyOrIndex] = value;
                source.value = copy;
            },
        );
    } else {
        return new DerivedSignal<TSource[TKeyOrIndex]>(() => source.value[key]);
    }
}
