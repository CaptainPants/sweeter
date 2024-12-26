import {
    addExplicitStrongReference,
    arrayExcept,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import { SignalController } from '../SignalController';
import { Signal } from '../types';
import { SignalState } from '../SignalState';
import { $peek } from '../$val';
import { $controller } from '../$controller';

export type IdentityCacheItem<TInput, TMapped> = {
    source: TInput;
    mappedElement: TMapped;
    indexSignal: Signal<number>;
    indexController: SignalController<number>;
};

export function createIdentityCache<TInput, TMapped>() {
    const cache = new Map<TInput, IdentityCacheItem<TInput, TMapped>>();
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
        removeOtherItemsOnChange(inputValues: Signal<readonly TInput[]>) {
            const cleanup = inputValues.listenWeak(this.__removeUnusedListener); // kept alive by this.keepAliveWith
            referencedSignals.push(inputValues);
            whenGarbageCollected(this, cleanup);
        },
        cacheEntries() {
            return [...cache.values()];
        },
        get(
            input: TInput,
            initialIndex: number,
            mappingFun: (input: TInput, index: Signal<number>) => TMapped,
        ): IdentityCacheItem<TInput, TMapped> {
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
        __cache: cache, // keep the cache and its content referenced and alive
        __clearOnChangeList: referencedSignals, // keep the cache and its content referenced and alive
    };

    return res;
}
