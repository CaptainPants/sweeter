import { $calc, $mutable, $val, getRuntime, isSignal } from '../index.js';
import { type Signal } from '../signals/types.js';
import {
    type MightBeSignal,
    type ComponentInit,
    type SignalifyProps,
} from '../types.js';

export type ForEachProps<T> = SignalifyProps<{
    items: readonly T[];
    renderItem: (item: Signal<T>, index: number) => JSX.Element;
}>;

export function ForEach<T>(
    props: ForEachProps<T>,
    init: ComponentInit,
): JSX.Element;
export function ForEach<T>(
    { items, renderItem }: ForEachProps<T>,
    init: ComponentInit,
): JSX.Element {
    if (!isSignal(items)) {
        // constant array, we can skip a lot of voodoo - the $calc is just because renderItem could be a signal
        return $calc(() =>
            items.map((x, i) => $val(renderItem)($mutable(x), i)),
        );
    }

    // items is a signal, we need to keep track of a signal for every item
    // including if it changes lengths to dispose/orphan signals that no longer
    // point to a valid index, and add new signals when necessary.

    throw new TypeError('Not implemented');
}

export function $foreach<T>(
    items: MightBeSignal<readonly T[]>,
    renderItem: MightBeSignal<(item: Signal<T>, index: number) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(ForEach<T>, { items, renderItem });
}
