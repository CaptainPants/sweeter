import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import { $peek, $subscribe, $val } from './$val.js';
import { $constant } from './$constant.js';
import { SignalState } from './SignalState.js';
import { createIdentityCache } from './internal/createIdentityCache.js';

export function $mapByIdentity<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>,
    orderBy: (obj: TMapped, source: TInput) => string | number,
): Signal<readonly TMapped[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $derived is just because renderItem could be a signal
        return $derived(() =>
            items.map((item, i) => $val(mappingFun)(item, $constant(i))),
        );
    }

    const cache = createIdentityCache<TInput, TMapped>();

    if (isSignal(mappingFun)) {
        cache.clearOnChange(mappingFun); // If the mapping function changes, clear the cache
    }

    if (isSignal(items)) {
        cache.removeOtherItemsOnChange(items); // If the input signal changes, remove any items that are no longer in the input
    }

    const resultSignal = $derived(() => {
        // subscribe to changes, but ignore the actual value for now
        $subscribe(mappingFun);
        // subscibes to items
        $subscribe(items); // we actually read from this via cache, so don't access its .value ourselves

        const orderedKeys = cache
            .cacheEntries()
            .sort((a, b) => {
                const aOrder = orderBy(a.mappedElement, a.source);
                const bOrder = orderBy(b.mappedElement, b.source);
                return aOrder < bOrder ? -1 : aOrder === bOrder ? 0 : 1;
            })
            .map((x) => x.source);

        let index = 0;
        const result: TMapped[] = [];

        for (const item of orderedKeys) {
            let match = cache.get(item, index, $peek(mappingFun));

            // Avoid the object allocation here if the index is already correct
            if (match.indexSignal.peek() !== index) {
                match.indexController.updateState(SignalState.success(index));
            }

            ++index;
        }

        return result;
    });

    cache.keepAliveWith(resultSignal); // Keep the cache object alive as long as resultSignal is alive

    return resultSignal;
}
