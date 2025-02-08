### $mapByIndex
The signature is:
```tsx
export function $mapByIndex<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: Signal<TInput>, index: number) => TMapped>,
): Signal<readonly TMapped[]>
```

This function lets you map from a Signal<T[]> input, through a mapping function, handling updates without rebuilding the result but rather updating the signals passed to mappingFun. $mapByIndex will update the value signal for each element, keeping the index constant.

### $mapByIdentity
The signature is:
```tsx
/**
 * Create a new signal by mapping each element of an input signal, using a mapping function.
 * @param items
 * @param getIdentity
 * @param mappingFun
 * @param orderBy
 * @returns
 */
export function $mapByIdentity<TInput, TIdentity, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    getIdentity: (input: TInput) => TIdentity,
    mappingFun: MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>,
): Signal<readonly TMapped[]>;
/**
 * Create a new signal by mapping each element of an input signal, using a mapping function.
 *
 * The input itself is used as the identity for caching.
 * @param items
 * @param mappingFun
 * @param orderBy
 * @returns
 */
export function $mapByIdentity<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>,
): Signal<readonly TMapped[]>;
```

This function lets you map from a Signal<T[]> input, through a mapping function, handling updates without rebuilding the result but rather updating the signals passed to mappingFun. $mapByIdentity will update the index signal for each element, keeping the value constant. This uses a Map internally, which uses SameValueZero equality. You can use a callback to provide an alternative identity for objects (E.g a private key).
