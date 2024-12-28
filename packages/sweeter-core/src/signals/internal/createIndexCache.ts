import {
    addExplicitStrongReference,
    arrayExcept,
    assertNotNullOrUndefined,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import { Signal } from '../types';
import { SignalState } from '../SignalState';
import { $val } from '../$val';
import { $derived } from '../$derived';
import { MightBeSignal } from '../../types';

export type IndexCacheItem<TMapped> = {
    mappedElement: Signal<TMapped>;
    detacher: AbortController;
};

export function createIndexCache<TInput, TMapped>() {
    const cache: IndexCacheItem<TMapped>[] = [];
    const referencedSignals: Signal<unknown>[] = [];

    const res = {
        clearOnChange(signal: Signal<unknown>) {
            referencedSignals.push(signal);
            const cleanup = signal.listenWeak(this.__clear); // kept alive by this.keepAliveWith
            whenGarbageCollected(signal, cleanup);
        },
        keepAliveWith(signal: Signal<unknown>) {
            addExplicitStrongReference(signal, this);
        },
        shrinkOnChange(inputValues: Signal<readonly TInput[]>) {
            const cleanup = inputValues.listenWeak(this.__shrink); // kept alive by this.keepAliveWith
            referencedSignals.push(inputValues);
            whenGarbageCollected(this, cleanup);
        },
        cacheEntries() {
            return [...cache.values()];
        },
        get(
            index: number,
            items: Signal<readonly TInput[]>,
            mappingFun: MightBeSignal<
                (input: Signal<TInput>, index: number) => TMapped
            >,
        ): Signal<TMapped> {
            const found = cache[index];
            if (found) {
                return found.mappedElement;
            } else {
                const detach = new AbortController();

                const input = $derived(() => $val(items)[index] as TInput, {
                    release: detach.signal,
                });
                const mapped = $derived(() => {
                    const mapped = $val(mappingFun)(input, index);
                    return mapped;
                });

                const res: IndexCacheItem<TMapped> = {
                    mappedElement: mapped,
                    detacher: detach,
                };

                cache[index] = res;

                return res.mappedElement;
            }
        },
        // Assigned to this object so that it can be implicitly kept alive with it (via .keepAliveWith)
        __shrink: (newState: SignalState<readonly TInput[]>) => {
            const itemsResolved = SignalState.getValue(newState);

            if (itemsResolved.length < cache.length) {
                // we are basically just orphaning the old signals - we don't want them to
                // throw or anything as there is potentially UI hooked up to them that would
                // throw to an ErrorBoundary or something

                for (let i = itemsResolved.length; i < cache.length; ++i) {
                    const item = cache[i];
                    assertNotNullOrUndefined(item);

                    // Releases the calculated signal (preserving its last value so that
                    // dependencies don't fail in unexpected ways before updating)
                    item.detacher.abort();
                }

                // reduce the array length
                cache.length = itemsResolved.length;
            }
        },
        // Assigned to this object so that it can be implicitly kept alive with it (via .keepAliveWith)
        __clear: () => {
            for (const item of cache) {
                item.detacher.abort();
            }
            cache.length = 0;
        },
        __cache: cache, // keep the cache and its content referenced and alive
        __clearOnChangeList: referencedSignals, // keep the cache and its content referenced and alive
    };

    return res;
}
