import { equals } from '@serpentis/ptolemy-utilities';

import { $derived } from '../signals/$derived.js';
import { $filtered } from '../signals/$filtered.js';
import { isSignal } from '../signals/isSignal.js';
import { type Signal } from '../signals/types.js';

export type FlattenedElement = Exclude<
    JSX.Element,
    readonly JSX.Element[] | null | undefined | Signal<JSX.Element> | boolean
>;

function isArray(item: unknown): item is readonly unknown[] {
    // Annoyingly Array.isArray is not using readonly
    return Array.isArray(item);
}

/**
 * Flattens nested arrays and calls .value on signals. Removes null and undefined
 * @param children
 * @returns
 */
export function flattenElements(
    children: JSX.Element,
): Signal<FlattenedElement[]> {
    const flattenElements_calc = () => {
        const next: FlattenedElement[] = [];
        flattenElementImplementation(children, next);
        return next;
    };
    const result = $derived(flattenElements_calc);
    const memoized = $filtered(result, equals.arrayElements);
    return memoized;
}

function flattenElementImplementation(
    children: JSX.Element,
    output: FlattenedElement[],
): void {
    if (children === null || children === undefined) {
        return;
    }

    if (isArray(children)) {
        children.forEach((inner) => {
            flattenElementImplementation(inner, output);
        });
    } else if (isSignal(children)) {
        // Note that this can be recursive if the result is a signal
        flattenElementImplementation(children.value, output);
    } else if (typeof children === 'boolean') {
        return; // So that && an || expressions can be used a la React
    } else {
        output.push(children);
    }
}
