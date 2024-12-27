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
import { MightBeSignal } from '../../types';
import { subscribeToChanges } from '../subscribeToChanges';

export type IdentityCacheItem<TInput, TMapped> = {
    source: TInput;
    mappedElement: TMapped;
    indexController: SignalController<number>;
};

export function createIdentityCache<TInput, TMapped>() {
    const cache = new Map<TInput, IdentityCacheItem<TInput, TMapped>>();
    const keepalive: unknown[] = [];

    const res = {
        clearOnChange(signal: Signal<unknown>) {
            keepalive.push(signal);
            const cleanup = signal.listenWeak(this.__clear); // kept alive by this.keepAliveWith
            whenGarbageCollected(signal, cleanup);
        },
        keepAliveWith(signal: Signal<unknown>) {
            addExplicitStrongReference(signal, this);
        },
        updateOnChange(
            items: MightBeSignal<readonly TInput[]>,
            mappingFun: MightBeSignal<
                (item: TInput, index: Signal<number>) => TMapped
            >,
            orderBy: MightBeSignal<
                (obj: TMapped, source: TInput) => string | number
            >,
        ) {
            const cleanup = subscribeToChanges(
                [items, mappingFun, orderBy],
                ([items, mappingFun, orderBy]) => {
                    this.update(items, mappingFun, orderBy);
                },
                false,
                false, // weak
            );
            whenGarbageCollected(this, cleanup);
        },
        getItems(): IdentityCacheItem<TInput, TMapped>[] {
            const items = [...cache.values()];
            items.sort(
                (a, b) =>
                    a.indexController.signal.peek() -
                    b.indexController.signal.peek(),
            );
            return items;
        },
        // Assigned to this object so that it can be implicitly kept alive with it (via .keepAliveWith)
        update(
            items: readonly TInput[],
            mappingFun: (item: TInput, index: Signal<number>) => TMapped,
            orderBy: (obj: TMapped, source: TInput) => string | number,
        ) {
            // Any items that no longer exist, detach their index signal and remove them
            for (const removed of arrayExcept([...cache.keys()], items)) {
                cache.get(removed)?.indexController.disconnect();
                cache.delete(removed);
            }

            const ordered = items
                .map((item, index) => {
                    let found = cache.get(item);
                    if (!found) {
                        const controller = $controller(
                            SignalState.success(index),
                        );
                        found = {
                            source: item,
                            mappedElement: mappingFun(item, controller.signal),
                            indexController: controller,
                        };
                        cache.set(item, found);
                    }
                    return found;
                })
                .sort((a, b) => {
                    const aOrder = orderBy(a.mappedElement, a.source);
                    const bOrder = orderBy(b.mappedElement, b.source);
                    return aOrder < bOrder ? -1 : aOrder === bOrder ? 0 : 1;
                });

            let index = 0;

            for (const item of ordered) {
                // Avoid the object allocation here if the index is already correct
                if (item.indexController.signal.peek() !== index) {
                    item.indexController.updateState(
                        SignalState.success(index),
                    );
                }

                ++index;
            }
        },
        // Assigned to this object so that it can be implicitly kept alive with it (via .keepAliveWith)
        __clear: () => {
            cache.clear();
        },
        __cache: cache, // keep the cache and its content referenced and alive
        __clearOnChangeList: keepalive, // keep the cache and its content referenced and alive
    };

    return res;
}
