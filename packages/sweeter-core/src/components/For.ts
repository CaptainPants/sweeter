import {
    $calc,
    $mutable,
    $peek,
    $invalidateOnChange,
    $val,
    getRuntime,
    isSignal,
    trackingIsAnError,
} from '../index.js';
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
        orphan: AbortController;
    }[] = [];

    // Clear the cache if the render function changes
    init.subscribeToChanges([renderItem], () => {
        elementCache.length = 0;
    });

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    return $calc(() => {
        // subscribe to changes, but ignore the actual value for now
        $invalidateOnChange(renderItem);

        // subscibes to items
        const itemsResolved = $val(items);

        if (elementCache.length > itemsResolved.length) {
            // we are basically just orphaning the old signals - we don't want them to
            // throw or anything as there is potentially UI hooked up to them that would
            // throw to an ErrorBoundary or something

            for (let i = itemsResolved.length; i < elementCache.length; ++i) {
                // Releases the calculated signal (preserving its last value so that
                // dependencies don't fail in unexpected ways before updating)
                elementCache[i]!.orphan.abort();
            }

            // reduce the array length
            elementCache.length = itemsResolved.length;
        } else {
            if (elementCache.length < itemsResolved.length) {
                trackingIsAnError(() => {
                    // For the rest, add a new signal and render an item
                    while (elementCache.length < itemsResolved.length) {
                        const index = elementCache.length;
                        const release = new AbortController();

                        const elementSignal = $calc<T>(
                            () => {
                                return $val(items)[index]!;
                            },
                            { release: release.signal },
                        );

                        elementCache.push({
                            // We use init.subscribeToChanges([renderItem]) earlier, so $peek to avoid subscribing at multiple levels
                            element: $peek(renderItem)(elementSignal, index),
                            orphan: release,
                        });
                    }
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
