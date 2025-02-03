import { getRuntime } from '../runtime/Runtime.js';
import { $mapByIndex } from '../signals/$mapByIndex.js';
import { type Signal } from '../signals/types.js';
import {
    type ComponentInit,
    type MightBeSignal,
    PropsDef,
} from '../types/index.js';

export interface ForProps<T> {
    each: readonly T[];
    children: (item: Signal<T>, index: number) => JSX.Element;
}

export function For<T>(
    props: PropsDef<ForProps<T>>,
    init: ComponentInit,
): JSX.Element;
export function For<T>({
    each: items,
    children: renderItem,
}: PropsDef<ForProps<T>>): JSX.Element {
    return $mapByIndex(items, renderItem);
}

export function $foreach<T>(
    items: MightBeSignal<readonly T[]>,
    renderItem: MightBeSignal<(item: Signal<T>, index: number) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(For<T>, { each: items, children: renderItem });
}
