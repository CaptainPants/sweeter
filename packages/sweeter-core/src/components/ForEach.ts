import { getRuntime } from '../index.js';
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
    throw new TypeError('Not implemented');
}

export function $foreach<T>(
    items: MightBeSignal<readonly T[]>,
    renderItem: MightBeSignal<(item: Signal<T>, index: number) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(ForEach<T>, { items, renderItem });
}
