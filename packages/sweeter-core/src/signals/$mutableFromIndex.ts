import { MutableCalculatedSignal } from './internal/MutableCalculatedSignal.js';
import { type ReadWriteSignal } from './types.js';

/**
 * Create a new ReadWriteSignal signal derived from an existing ReadWriteSignal, by following an index (e.g. array index or object key). Changes will be propogated back by shallow cloning.
 * @param source
 * @param key
 * @returns
 */
export function $mutableFromIndex<TSource, TKey extends keyof TSource>(
    source: ReadWriteSignal<TSource>,
    key: TKey,
): ReadWriteSignal<TSource[TKey]> & { value: TSource[TKey] } {
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
