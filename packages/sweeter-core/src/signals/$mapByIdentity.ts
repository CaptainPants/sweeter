import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import {
    addExplicitStrongReference,
    assertNotNullOrUndefined,
} from '@captainpants/sweeter-utilities';
import { SignalController } from './SignalController.js';
import { $controller } from './$controller.js';
import { SignalState } from './SignalState.js';
import { $peek } from './$val.js';

type IdentityCacheItem<TInput, TMapped> = {
    source: TInput;
    mappedElement: TMapped;
    indexController: SignalController<number>;
};

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
    const cache = $controller(
        SignalState.success<IdentityCacheItem<TInput, TMapped>[]>([]),
    );

    const callbacks = {
        reset: () => {
            cache.updateState(SignalState.success([]));

            callbacks.update();
        },
        update: () => {
            const mappingFunResolved = $peek(mappingFun);

            const oldCache = cache.signal.peek();

            const oldCacheMap = new Map<
                TInput,
                IdentityCacheItem<TInput, TMapped>[]
            >();
            for (let index = 0; index < oldCache.length; ++index) {
                const item = oldCache[index];
                assertNotNullOrUndefined(item);

                let found = oldCacheMap.get(item.source);
                if (!found) {
                    found = [];
                    oldCacheMap.set(item.source, found);
                }

                found.push(item);
            }

            function getAndRemoveFromCache(input: TInput) {
                const fromCache = oldCacheMap.get(input);
                if (fromCache) {
                    const result = fromCache[0];
                    if (fromCache.length > 1) {
                        // If more than once, remove the first one
                        fromCache.shift();
                    } else {
                        oldCacheMap.delete(input);
                    }
                    return result;
                }
                return undefined;
            }

            const newCacheContent: IdentityCacheItem<TInput, TMapped>[] = [];

            const updatedInputs = $peek(items);
            for (let index = 0; index < updatedInputs.length; ++index) {
                const input = updatedInputs[index] as TInput;

                let entry = getAndRemoveFromCache(input);
                if (entry) {
                    // If already in cache, update the index signal if needed
                    if (entry.indexController.signal.peek() !== index) {
                        entry.indexController.updateState(
                            SignalState.success(index),
                        );
                    }
                } else {
                    // Otherwise we need a new cache entry
                    const indexController = $controller(
                        SignalState.success(index),
                    );
                    entry = {
                        source: input,
                        mappedElement: mappingFunResolved(
                            input,
                            indexController.signal,
                        ),
                        indexController: indexController,
                    };
                }
                newCacheContent.push(entry);
            }

            cache.updateState(SignalState.success(newCacheContent));
        },
    };

    // Initially fill the cache
    callbacks.update();

    if (isSignal(mappingFun)) {
        mappingFun.listenWeak(callbacks.reset);
    }

    if (isSignal(items)) {
        items.listenWeak(callbacks.update);
    }

    const resultSignal = $derived(() => {
        return cache.signal.value.map((x) => x.mappedElement);
    });

    addExplicitStrongReference(resultSignal, callbacks);

    return resultSignal;
}
