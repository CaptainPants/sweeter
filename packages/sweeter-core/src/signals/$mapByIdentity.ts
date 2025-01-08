import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import {
    addExplicitStrongReference,
    assertNotNullOrUndefined,
    equals,
} from '@captainpants/sweeter-utilities';
import { SignalController } from './SignalController.js';
import { $controller } from './$controller.js';
import { SignalState } from './SignalState.js';
import { $peek, $val, $wrap } from './$val.js';
import { $filtered } from './$filtered.js';

type IdentityCacheItem<TInput, TIdentity, TMapped> = {
    source: TInput;
    identity: TIdentity;
    mappedElement: TMapped;
    indexController: SignalController<number>;
};

function providedIdentityFun<TInput, TIdentity, TMapped>(args: [MightBeSignal<(input: TInput) => TIdentity>, MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>] | [MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>]): args is [MightBeSignal<(input: TInput) => TIdentity>, MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>] {
    return args.length >= 2;
}

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
export function $mapByIdentity<TInput, TIdentity, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    ...rest: 
        | [MightBeSignal<(input: TInput) => TIdentity>, MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>] 
        | [MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>]
): Signal<readonly TMapped[]>{
    if (providedIdentityFun(rest)) {
        return mapByIdentity(items, ...rest);
    }
    else {
        return mapByIdentity(items, x => x, ...rest);
    }
}

function mapByIdentity<TInput, TIdentity, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    getIdentity: MightBeSignal<(input: TInput) => TIdentity>,
    mappingFun: MightBeSignal<(item: TInput, index: Signal<number>) => TMapped>,
): Signal<readonly TMapped[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $derived is just because renderItem could be a signal
        return $derived(() =>
            items.map((item, i) => $val(mappingFun)(item, $wrap(i))),
        ).doNotIdentify();
    }

    const cache = $controller(
        SignalState.success<IdentityCacheItem<TInput, TIdentity, TMapped>[]>([]),
    );

    const callbacks = {
        reset: () => {
            callbacks.change(true);
        },
        update: () => {
            callbacks.change(false);
        },
        change: (clear = true) => {
            const mappingFunResolved = $peek(mappingFun);

            const oldCache = cache.signal.peek();

            const oldCacheMap = new Map<
                TIdentity,
                IdentityCacheItem<TInput, TIdentity, TMapped>[]
            >();
            if (clear) {
                for (const item of oldCache) {
                    item.indexController.disconnect();
                }
                // do not populate oldCacheMap
            } else {
                for (let index = 0; index < oldCache.length; ++index) {
                    const item = oldCache[index];
                    assertNotNullOrUndefined(item);

                    let found = oldCacheMap.get(item.identity);
                    if (!found) {
                        found = [];
                        oldCacheMap.set(item.identity, found);
                    }

                    found.push(item);
                }
            }

            function getAndRemoveFromCache(identity: TIdentity) {
                const fromCache = oldCacheMap.get(identity);
                if (fromCache) {
                    const result = fromCache[0];
                    if (fromCache.length > 1) {
                        // If more than once, remove the first one
                        fromCache.shift();
                    } else {
                        oldCacheMap.delete(identity);
                    }
                    return result;
                }
                return undefined;
            }

            const newCacheContent: IdentityCacheItem<TInput, TIdentity, TMapped>[] = [];

            const updatedInputs = $peek(items);
            const getIdentityResolved = $peek(getIdentity);

            for (let index = 0; index < updatedInputs.length; ++index) {
                const input = updatedInputs[index] as TInput;

                const identity = getIdentityResolved(input);

                let entry = getAndRemoveFromCache(identity);
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
                        identity: identity,
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
    callbacks.reset();

    if (isSignal(mappingFun)) {
        // mappingFun is kept alive by its usage in callbacks
        mappingFun.listenWeak(callbacks.reset);
    }
    if (isSignal(getIdentity)) {
        // getIdentity is kept alive by its usage in callbacks
        getIdentity.listenWeak(callbacks.reset);
    }

    // items is kept alive by its usage in callbacks
    items.listenWeak(callbacks.update);

    const resultSignal = $derived(() => {
        return cache.signal.value.map((x) => x.mappedElement);
    });

    addExplicitStrongReference(resultSignal, callbacks);

    // Its entirely possible we've generated the same array
    // in which case we want to avoid updating anything
    return $filtered(resultSignal, equals.arrayElements).doNotIdentify();
}
