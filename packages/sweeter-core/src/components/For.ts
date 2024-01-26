import { getRuntime } from '../index.js';
import { $map } from '../signals/$map.js';
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
export function For<T>({
    each: items,
    children: renderItem,
}: ForProps<T>): JSX.Element {
    return $map(items, renderItem);
}

export function $foreach<T>(
    items: MightBeSignal<readonly T[]>,
    renderItem: MightBeSignal<(item: Signal<T>, index: number) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(For<T>, { each: items, children: renderItem });
}
