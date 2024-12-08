import {
    arrayExcept,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import {
    $calc,
    $peek,
    $subscribe,
    $val,
    isSignal,
    $constant,
    type SignalController,
    $controller,
    SignalState,
} from '../index.js';
import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';

export function $mapByIdentity<T, U>(
    items: MightBeSignal<readonly T[]>,
    map: MightBeSignal<(item: T, index: Signal<number>) => U>,
    orderBy: (obj: U) => string | number,
): Signal<readonly U[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $calc is just because renderItem could be a signal
        return $calc(() =>
            items.map((item, i) => $val(map)(item, $constant(i))),
        );
    }

    // This seems fairly abusive of the dependency tracking system - but ... eh
    const elementCache = new Map<
        T,
        {
            source: T;
            mappedElement: U;
            indexSignal: Signal<number>;
            indexController: SignalController<number>;
        }
    >();

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    const resultSignal = $calc(() => {
        // subscribe to changes, but ignore the actual value for now
        $subscribe(map);

        // subscibes to items
        const itemsResolved = $val(items);

        for (const removed of arrayExcept(
            [...elementCache.keys()],
            itemsResolved,
        )) {
            elementCache.delete(removed);
        }

        const orderedKeys = [...elementCache.values()]
            .sort((a, b) => {
                const aOrder = orderBy(a.mappedElement);
                const bOrder = orderBy(b.mappedElement);
                return aOrder < bOrder ? -1 : aOrder === bOrder ? 0 : 1;
            })
            .map((x) => x.source);

        let index = 0;
        const result: U[] = [];

        for (const item of orderedKeys) {
            let match = elementCache.get(item);
            if (match) {
                // Avoid the object allocation here if the index is already correct
                if (match.indexSignal.value !== index) {
                    match.indexController.updateState(
                        SignalState.success(index),
                    );
                }
            } else {
                const indexController = $controller<number>(
                    SignalState.success(index),
                );
                match = {
                    source: item,
                    mappedElement: $peek(map)(item, indexController.signal),
                    indexSignal: indexController.signal,
                    indexController,
                };
            }
            result.push(match.mappedElement);

            ++index;
        }

        return result;
    });

    // Clear the cache if the map function changes
    const resetCache = () => {
        elementCache.clear();
    };

    if (isSignal(map)) {
        const cleanup = map.listen(resetCache);

        // When the signal is no longer reachable, stop listening
        // Nothing in this method references resultSignal so this
        // should be pretty safe.
        whenGarbageCollected(resultSignal, cleanup);
    }

    return resultSignal;
}
