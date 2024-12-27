import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import { $val, $wrap } from './$val.js';
import { createIndexCache } from './internal/createIndexCache.js';

export function $mapByIndex<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: Signal<TInput>, index: number) => TMapped>,
): Signal<readonly TMapped[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $derived is just because renderItem could be a signal
        return $derived(() =>
            items.map((item, i) => $val(mappingFun)($wrap(item), i)),
        );
    }

    // This seems fairly abusive of the dependency tracking system - but ... eh
    const cache = createIndexCache<TInput, TMapped>();

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    if (isSignal(mappingFun)) {
        cache.clearOnChange(mappingFun);
    }

    if (isSignal(items)) {
        cache.shrinkOnChange(items); // If the input signal changes, remove any items that are no longer in the input
    }

    const resultSignal = $derived(() => {
        // subscibes to items
        const itemsResolved = $val(items); // We need this for the array length

        return itemsResolved.map((_, index) => {
            const cacheItem = cache.get(index, items, mappingFun);
            return cacheItem.value; // Subscribe to every member signal
        });
    });

    cache.keepAliveWith(resultSignal); // Keep the cache object alive as long as resultSignal is alive

    return resultSignal;
}
