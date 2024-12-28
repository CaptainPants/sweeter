import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import { $peek, $subscribe, $val } from './$val.js';
import { $constant } from './$constant.js';
import { createIdentityCache } from './internal/createIdentityCache.js';

/**
 * Create a new signal by mapping each element of an input signal, using a mapping function.
 * @param items
 * @param mappingFun
 * @param orderBy
 * @returns
 */
export function $mapByIdentity<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>,
): Signal<readonly TMapped[]> {
    const cache = createIdentityCache<TInput, TMapped>();

    if (isSignal(mappingFun)) {
        cache.clearOnChange(mappingFun); // If the mapping function changes, clear the cache
    }

    // If the input signal changes, remove any items that are no longer in the input
    // This may also be triggered by the mappingFun value changing, which will also
    // trigger a clear to happen, prior to the fixUpIndexes
    cache.updateOnChange(items, mappingFun);
    cache.update($peek(items), $peek(mappingFun));

    const resultSignal = $derived(() => {
        $subscribe(mappingFun); // If the mapping function changes, the whole cache is invalidated, and we need to load our data again
        $subscribe(items);

        const cacheItems = cache.getItems();

        return cacheItems.map((x) => x.mappedElement);
    });

    cache.keepAliveWith(resultSignal); // Keep the cache object alive as long as resultSignal is alive

    return resultSignal;
}
