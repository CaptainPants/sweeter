import { $calc, $mutable, $val, getRuntime, isSignal } from '../index.js';
import { type ReadWriteSignal, type Signal } from '../signals/types.js';
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
    const existingElements: { ele: JSX.Element; value: ReadWriteSignal<T> }[] =
        [];

    // Clear the cache if the render function changes
    init.subscribeToChanges([renderItem], () => {
        existingElements.length = 0;
    });

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    return $calc(() => {
        const itemsResolved = $val(items);
        if (existingElements.length > itemsResolved.length) {
            // we are basically just orphaning the old signals - we don't want them to
            // throw or anything as there is potentially UI hooked up to them that would
            // throw to an ErrorBoundary or something
            existingElements.length = itemsResolved.length;
        } else {
            // For all the items where there was an existingElement entry,
            // update the related signal.
            for (let i = 0; i < existingElements.length; ++i) {
                existingElements[i]!.value.update(itemsResolved[i]!);
            }
            // For the rest, add a new signal and render an item
            while (existingElements.length < itemsResolved.length) {
                const index = existingElements.length;
                const elementSignal = $mutable<T>(itemsResolved[index]!);

                existingElements.push({
                    ele: $val(renderItem)(elementSignal, index),
                    value: elementSignal,
                });
            }
        }

        return existingElements.map((x) => x.ele);
    });
}

export function $foreach<T>(
    items: MightBeSignal<readonly T[]>,
    renderItem: MightBeSignal<(item: Signal<T>, index: number) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(For<T>, { each: items, children: renderItem });
}
