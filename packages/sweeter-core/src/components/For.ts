import { $calc, $mutable, $val, getRuntime, isSignal } from '../index.js';
import { type Signal } from '../signals/types.js';
import {
    type MightBeSignal,
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '../types.js';

export type ForProps<T> = PropertiesMightBeSignals<{
    each: readonly T[];
    children: (item: Signal<T>, index: number) => JSX.Element;
}>;

export function For<T>(props: ForProps<T>, init: ComponentInit): JSX.Element;
export function For<T>(
    { each: items, children: renderItem }: ForProps<T>,
    init: ComponentInit,
): JSX.Element {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $calc is just because renderItem could be a signal
        return $calc(() =>
            items.map((item, i) => $val(renderItem)($mutable(item), i)),
        );
    }

    // This seems fairly abusive of the dependency tracking system - but ... eh
    const elementCache: {
        element: JSX.Element;
        signal: Signal<T>;
        orphaned: { value: boolean };
    }[] = [];

    // Clear the cache if the render function changes
    init.subscribeToChanges([renderItem], () => {
        elementCache.length = 0;
    });

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    return $calc(() => {
        const itemsResolved = $val(items);
        if (elementCache.length > itemsResolved.length) {
            // we are basically just orphaning the old signals - we don't want them to
            // throw or anything as there is potentially UI hooked up to them that would
            // throw to an ErrorBoundary or something

            for (let i = itemsResolved.length; i < elementCache.length; ++i) {
                elementCache[i]!.orphaned.value = true;
            }

            elementCache.length = itemsResolved.length;
        } else {
            // For the rest, add a new signal and render an item
            while (elementCache.length < itemsResolved.length) {
                const index = elementCache.length;

                // This basically exists so that an orphaned signal won't cause exceptions
                // if a signal is orphaned we just keep returning its
                let mostRecentResult: T = itemsResolved[index]!;
                const orphaned = { value: false };

                const elementSignal = $calc<T>(() => {
                    if (!orphaned.value) {
                        mostRecentResult = itemsResolved[index]!;
                    }

                    return mostRecentResult;
                });

                elementCache.push({
                    element: $val(renderItem)(elementSignal, index),
                    signal: elementSignal,
                    orphaned: orphaned,
                });
            }
        }

        return elementCache.map((x) => x.element);
    });
}

export function $foreach<T>(
    items: MightBeSignal<readonly T[]>,
    renderItem: MightBeSignal<(item: Signal<T>, index: number) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(For<T>, { each: items, children: renderItem });
}
