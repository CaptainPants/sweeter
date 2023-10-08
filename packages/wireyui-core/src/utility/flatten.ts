import { type Signal, isSignal } from '../index.js';

export type FlattenedElement = Exclude<
    JSX.Element,
    JSX.Element[] | null | undefined | Signal<JSX.Element>
>;

/**
 * Flattens nested arrays and calls .value on signals. Removes null and undefined
 * @param children
 * @returns
 */
export function flatten(children: JSX.Element) {
    const res: FlattenedElement[] = [];
    flattenImplementation(children, res);
    return res;
}

function flattenImplementation(
    children: JSX.Element,
    output: FlattenedElement[],
): void {
    if (children === null || children === undefined) {
        return;
    }

    if (Array.isArray(children)) {
        children.forEach((inner) => {
            flattenImplementation(inner, output);
        });
    } else if (isSignal(children)) {
        // Note that this can be recursive if the result is a signal
        flattenImplementation(children.value, output);
    } else {
        output.push(children);
    }
}
