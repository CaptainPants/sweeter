import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';
import { MutableDerivedSignal } from './internal/Signal-implementations/MutableDerivedSignal.js';
import { isReadWriteSignal } from './isSignal.js';
import { type ReadWriteSignal, type Signal } from './types.js';

/**
 * Create a new signal pointing to a property of an existing signal.
 *
 * If the source signal was mutable, and readonly = false, then changes are propogated back to the source signal.
 * @param source
 * @param keyOrIndex
 * @param readonly The derived signal must be readonly - Defaults to false
 */
export function $propertyOf<
    TSource,
    TKeyOrIndex extends keyof TSource & (string | symbol),
>(
    source: ReadWriteSignal<TSource>,
    keyOrIndex: TKeyOrIndex,
    /**
     * @default false
     */
    readonly?: boolean,
): ReadWriteSignal<TSource[TKeyOrIndex]>;

/**
 * Create a new signal pointing to a property of an existing signal.
 *
 * If the source signal was mutable, and readonly = false, then changes are propogated back to the source signal.
 * @param source
 * @param keyOrIndex
 * @param readonly The derived signal must be readonly - Defaults to false
 */
export function $propertyOf<
    TSource,
    TKey extends keyof TSource & (string | symbol),
>(
    source: Signal<TSource>,
    keyOrIndex: TKey,
    /**
     * @default false
     */
    readonly?: boolean,
): Signal<TSource[TKey]>;

export function $propertyOf<TSource, TKeyOrIndex extends keyof TSource>(
    source: Signal<TSource>,
    key: TKeyOrIndex,
    readonly: boolean = false,
): Signal<unknown> {
    if (isReadWriteSignal(source) && !readonly) {
        return new MutableDerivedSignal<TSource[TKeyOrIndex]>(
            () => source.value[key],
            (value) => {
                const sourceValue = source.value;

                if (typeof sourceValue === 'object' && sourceValue !== null) {
                    const copy = { ...sourceValue } as TSource;
                    copy[key] = value;
                    source.value = copy;
                } else {
                    throw new TypeError(
                        `Unexpected type ${
                            sourceValue == null ? 'null ' : typeof sourceValue
                        }`,
                    );
                }
            },
        );
    } else {
        return new DerivedSignal<TSource[TKeyOrIndex]>(() => source.value[key]);
    }
}
