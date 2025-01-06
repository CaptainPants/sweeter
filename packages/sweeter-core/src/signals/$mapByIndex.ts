import { type Signal } from '../signals/types.js';
import { type MightBeSignal } from '../types.js';
import { isSignal } from './isSignal.js';
import { $derived } from './$derived.js';
import { $peek, $val, $wrap } from './$val.js';
import {
    addExplicitStrongReference,
    assertNotNullOrUndefined,
} from '@captainpants/sweeter-utilities';
import { $controller } from './$controller.js';
import { SignalState } from './SignalState.js';
import { SignalController } from './SignalController.js';

export type IndexCacheItem<TInput, TMapped> = {
    mappedElement: TMapped;
    input: SignalController<TInput>;
};

export function $mapByIndex<TInput, TMapped>(
    items: MightBeSignal<readonly TInput[]>,
    mappingFun: MightBeSignal<(item: Signal<TInput>, index: number) => TMapped>,
): Signal<readonly TMapped[]> {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $derived is just because renderItem could be a signal
        return $derived(() =>
            items.map((item, i) => $val(mappingFun)($wrap(item), i)),
        ).doNotIdentify();
    }

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    const cache = $controller(
        SignalState.success<IndexCacheItem<TInput, TMapped>[]>([]),
    );

    // store these on an object that is then referenced from the result signal
    const callbacks = {
        reset: () => {
            callbacks.update(true);
        },
        change: () => {
            callbacks.update(false);
        },
        update: (clear: boolean) => {
            const mappingFunResolved = $peek(mappingFun);
            const updatedInputs = items.peek(); // cloned

            const cacheResolved = cache.signal.peek();
            let updatedCacheResolved: IndexCacheItem<TInput, TMapped>[];

            let meaningfullyChanged = false;

            if (clear) {
                // Act as if the previous cache was empty, and detach every item in the cache
                updatedCacheResolved = [];

                for (const item of cacheResolved) {
                    item.input.disconnect();
                }

                meaningfullyChanged = true;
            } else {
                updatedCacheResolved = [...cacheResolved];

                if (updatedInputs.length < updatedCacheResolved.length) {
                    for (
                        let index = updatedInputs.length;
                        index < updatedCacheResolved.length;
                        ++index
                    ) {
                        const item = updatedCacheResolved[index];
                        assertNotNullOrUndefined(item);

                        // Releases the calculated signal (preserving its last value so that
                        // dependencies don't fail in unexpected ways before updating)
                        item.input.disconnect();
                    }

                    updatedCacheResolved.length = updatedInputs.length;
                    meaningfullyChanged = true;
                }
            }

            for (let index = 0; index < updatedInputs.length; ++index) {
                const item = updatedInputs[index] as TInput;

                let entry = updatedCacheResolved[index];
                if (entry) {
                    const previousState = entry.input.signal.peekState();
                    if (
                        previousState.mode === 'SUCCESS' &&
                        !Object.is(previousState.value, item)
                    ) {
                        // Update the input signal if needed
                        entry.input.updateState(SignalState.success(item));
                    }
                } else {
                    const input = $controller(SignalState.success(item));
                    const mapped = mappingFunResolved(input.signal, index);

                    entry = {
                        mappedElement: mapped,
                        input: input,
                    };

                    updatedCacheResolved[index] = entry;
                    meaningfullyChanged = true;
                }
            }

            if (meaningfullyChanged) {
                cache.updateState(SignalState.success(updatedCacheResolved));
            }
        },
    };

    // Initially fill the cache
    callbacks.reset();

    if (isSignal(mappingFun)) {
        mappingFun.listenWeak(callbacks.reset);
    }

    items.listenWeak(callbacks.change);

    const resultSignal = $derived(() => {
        return cache.signal.value.map((x) => x.mappedElement);
    }).doNotIdentify();

    addExplicitStrongReference(resultSignal, callbacks);

    return resultSignal;
}
