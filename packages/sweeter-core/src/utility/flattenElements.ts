import { type Signal, isSignal, $calc } from '../signals/index.js';

export type FlattenedElement = Exclude<
    JSX.Element,
    readonly JSX.Element[] | null | undefined | Signal<JSX.Element> | boolean
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArray(item: unknown): item is readonly any[] {
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
    return $calc(() => {
        const res: FlattenedElement[] = [];
        flattenImplementation(children, res);
        return res;
    });
}

function flattenImplementation(
    children: JSX.Element,
    output: FlattenedElement[],
): void {
    if (children === null || children === undefined) {
        return;
    }

    if (isArray(children)) {
        children.forEach((inner) => {
            flattenImplementation(inner, output);
        });
    } else if (isSignal(children)) {
        // Note that this can be recursive if the result is a signal
        flattenImplementation(children.value, output);
    } else if (typeof children === 'boolean') {
        return; // So that && an || expressions can be used a la React
    } else {
        output.push(children);
    }
}
