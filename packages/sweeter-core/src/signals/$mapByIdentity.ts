import {
    arrayExcept,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derive } from './$derive.js';
import { $peek, $subscribe, $val } from './$val.js';
import { $constant } from './$constant.js';
import { SignalController } from './SignalController.js';
import { $controller } from './$controller.js';
import { SignalState } from './SignalState.js';

export function $mapByIdentity<T, U>(
    items: MightBeSignal<readonly T[]>,
    mappingFun: MightBeSignal<(item: T, index: Signal<number>) => U>,
    orderBy: (obj: U, source: T) => string | number,
): Signal<readonly U[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $derive is just because renderItem could be a signal
        return $derive(() =>
            items.map((item, i) => $val(mappingFun)(item, $constant(i))),
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

    let cleanup: (() => void) | undefined;

    if (isSignal(mappingFun)) {
        // Clear the cache if the map function changes
        const resetCache = () => {
            elementCache.clear();
        };

        cleanup = mappingFun.listen(resetCache);
    }

    const resultSignal = $derive(() => {
        // subscribe to changes, but ignore the actual value for now
        $subscribe(mappingFun);

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
                const aOrder = orderBy(a.mappedElement, a.source);
                const bOrder = orderBy(b.mappedElement, b.source);
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
                    mappedElement: $peek(mappingFun)(
                        item,
                        indexController.signal,
                    ),
                    indexSignal: indexController.signal,
                    indexController,
                };
            }
            result.push(match.mappedElement);

            ++index;
        }

        return result;
    });

    if (cleanup) {
        // When the signal is no longer reachable, stop listening
        // Nothing in this method references resultSignal so this
        // should be pretty safe.
        whenGarbageCollected(resultSignal, cleanup);
    }

    return resultSignal;
}
