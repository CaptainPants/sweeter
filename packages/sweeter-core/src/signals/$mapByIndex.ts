import {
    addExplicitStrongReference,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derive } from './$derive.js';
import { $peek, $subscribe, $val } from './$val.js';
import { $mutable } from './$mutable.js';
import { trackingIsAnError } from './ambient.js';

export function $mapByIndex<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: Signal<TInput>, index: number) => TMapped>,
): Signal<readonly TMapped[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $derive is just because renderItem could be a signal
        return $derive(() =>
            items.map((item, i) => $val(mappingFun)($mutable(item), i)),
        );
    }

    // This seems fairly abusive of the dependency tracking system - but ... eh
    const elementCache: {
        mappedElement: TMapped;
        detacher: AbortController;
    }[] = [];

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    // Clear the cache if the map function changes
    const resetCache = () => {
        for (const item of elementCache) {
            item.detacher.abort();
        }
        elementCache.length = 0;
    };

    let cleanup: (() => void) | undefined;

    if (isSignal(mappingFun)) {
        cleanup = mappingFun.listenWeak(resetCache);
    }

    const resultSignal = $derive(() => {
        // subscribe to changes, but ignore the actual value for now
        $subscribe(mappingFun);

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

                        const elementSignal = $derive<TInput>(
                            () => {
                                return $val(items)[index]!;
                            },
                            { release: detach.signal },
                        );

                        elementCache.push({
                            // We use init.onSignalChange([renderItem]) earlier, so $peek to avoid subscribing at multiple levels
                            mappedElement: $peek(mappingFun)(
                                elementSignal,
                                index,
                            ),
                            detacher: detach,
                        });
                    }
                });
            }
        }

        return elementCache.map((x) => x.mappedElement);
    });

    if (cleanup) {
        // When the signal is no longer reachable, stop listening
        // Nothing in this method references resultSignal so this
        // should be pretty safe.
        whenGarbageCollected(resultSignal, cleanup);
        addExplicitStrongReference(resultSignal, resetCache);
    }

    return resultSignal;
}
