import {
    $calc,
    $mutable,
    $peek,
    $invalidateOnChange,
    $val,
    isSignal,
    trackingIsAnError,
    addExplicitStrongReference,
} from '../index.js';
import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';

export function $map<T, U>(
    items: MightBeSignal<readonly T[]>,
    map: MightBeSignal<(item: Signal<T>, index: number) => U>,
): Signal<readonly U[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $calc is just because renderItem could be a signal
        return $calc(() =>
            items.map((item, i) => $val(map)($mutable(item), i)),
        );
    }

    // This seems fairly abusive of the dependency tracking system - but ... eh
    const elementCache: {
        mappedElement: U;
        detacher: AbortController;
    }[] = [];

    // Clear the cache if the map function changes
    const resetCache = () => {
        for (const item of elementCache) {
            item.detacher.abort();
        }
        elementCache.length = 0;
    };

    items.listen(resetCache, false);

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    const resultSignal = $calc(() => {
        // subscribe to changes, but ignore the actual value for now
        $invalidateOnChange(map);

        // subscibes to items
        const itemsResolved = $val(items);

        if (elementCache.length > itemsResolved.length) {
            // we are basically just orphaning the old signals - we don't want them to
            // throw or anything as there is potentially UI hooked up to them that would
            // throw to an ErrorBoundary or something

            for (let i = itemsResolved.length; i < elementCache.length; ++i) {
                // Releases the calculated signal (preserving its last value so that
                // dependencies don't fail in unexpected ways before updating)
                elementCache[i]!.detacher.abort();
            }

            // reduce the array length
            elementCache.length = itemsResolved.length;
        } else {
            if (elementCache.length < itemsResolved.length) {
                trackingIsAnError(() => {
                    // For the rest, add a new signal and render an item
                    while (elementCache.length < itemsResolved.length) {
                        const index = elementCache.length;
                        const detach = new AbortController();

                        const elementSignal = $calc<T>(
                            () => {
                                return $val(items)[index]!;
                            },
                            { release: detach.signal },
                        );

                        elementCache.push({
                            // We use init.onSignalChange([renderItem]) earlier, so $peek to avoid subscribing at multiple levels
                            mappedElement: $peek(map)(elementSignal, index),
                            detacher: detach,
                        });
                    }
                });
            }
        }

        return elementCache.map((x) => x.mappedElement);
    });

    // keep mapChange alive (and therefore receiving updates) as long as the result signal is alive
    addExplicitStrongReference(resultSignal, resetCache);

    return resultSignal;
}
