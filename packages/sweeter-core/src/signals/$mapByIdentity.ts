import {
    addExplicitStrongReference,
    arrayExcept,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import { $peek, $subscribe, $val } from './$val.js';
import { $constant } from './$constant.js';
import { SignalController } from './SignalController.js';
import { $controller } from './$controller.js';
import { SignalState } from './SignalState.js';

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

    // This seems fairly abusive of the dependency tracking system - but ... eh
    const elementCache = new Map<
        TInput,
        {
            source: TInput;
            mappedElement: TMapped;
            indexSignal: Signal<number>;
            indexController: SignalController<number>;
        }
    >();

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    // Clear the cache if the map function changes
    const resetCache = () => {
        elementCache.clear();
    };

    let cleanup: (() => void) | undefined;

    if (isSignal(mappingFun)) {
        cleanup = mappingFun.listenWeak(resetCache);
    }

    const resultSignal = $derived(() => {
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
        const result: TMapped[] = [];

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
        addExplicitStrongReference(resultSignal, resetCache);
    }

    return resultSignal;
}
