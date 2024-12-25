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

    const cache = createIdentityCache<TInput, TMapped>();

    if (isSignal(mappingFun)) {
        cache.clearOnChange(mappingFun);
    }

    if (isSignal(items)) {
        cache.removeOtherItemsOnChange(items);
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

    cache.keepAliveWith(resultSignal);

    return resultSignal;
}

type CacheItem<TInput, TMapped> = {
    source: TInput;
    mappedElement: TMapped;
    indexSignal: Signal<number>;
    indexController: SignalController<number>;
};

function createIdentityCache<TInput, TMapped>() {
    const cache = new Map<TInput, CacheItem<TInput, TMapped>>();

    const res = {
        clearOnChange(signal: Signal<unknown>) {
            signal.listenWeak(this.__clear); // kept alive by this.keepAliveWith
        },
        keepAliveWith(signal: Signal<unknown>) {
            addExplicitStrongReference(signal, this);
            whenGarbageCollected(signal, () => this.clearOnChange(signal));
        },
        removeOtherItemsOnChange(inputValues: Signal<readonly TInput[]>) {
            const cleanup = inputValues.listenWeak(this.__removeUnusedListener); // kept alive by this.keepAliveWith

            whenGarbageCollected(this, cleanup);
        },
        cacheEntries() {
            return [...cache.values()];
        },
        get(
            input: TInput,
            initialIndex: number,
            mappingFun: (input: TInput, index: Signal<number>) => TMapped,
        ): CacheItem<TInput, TMapped> {
            let match = cache.get(input);

            if (!match) {
                const indexController = $controller<number>(
                    SignalState.success(initialIndex),
                );
                match = {
                    source: input,
                    mappedElement: $peek(mappingFun)(
                        input,
                        indexController.signal,
                    ),
                    indexSignal: indexController.signal,
                    indexController,
                };
            }

            return match;
        },
        // Assigned to this object so that it can be implicitly kept alive with it (via .keepAliveWith)
        __removeUnusedListener: (newState: SignalState<readonly TInput[]>) => {
            const inputValues = SignalState.getValue(newState);

            for (const removed of arrayExcept([...cache.keys()], inputValues)) {
                cache.delete(removed);
            }
        },
        // Assigned to this object so that it can be implicitly kept alive with it (via .keepAliveWith)
        __clear: () => {
            cache.clear();
        },
        __cache: cache,
    };

    return res;
}
