import { type Signal } from '../signals/types.js';
import { isSignal } from '../signals/isSignal.js';
import { $calc } from '../signals/$calc.js';

export type FlattenedElement = Exclude<
    JSX.Element,
    readonly JSX.Element[] | null | undefined | Signal<JSX.Element> | boolean
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArray(item: unknown): item is readonly any[] {
    // Annoyingly Array.isArray is not using readonly
    return Array.isArray(item);
}

function shallowEqualArray<T>(a: readonly T[], b: readonly T[]) {
    return a.length === b.length && a.every((item, index) => item === b[index]);
}

/**
 * Flattens nested arrays and calls .value on signals. Removes null and undefined
 * @param children
 * @returns
 */
export function flattenElements(
    children: JSX.Element,
): Signal<FlattenedElement[]> {
    // cache the last value and return it if every element is the same
    let previous: FlattenedElement[] | undefined = undefined;

    const flattenElements_calc = () => {
        const next: FlattenedElement[] = [];

        flattenElementImplementation(children, next);

        if (previous && shallowEqualArray(previous, next)) {
            return previous;
        }

        return (previous = next);
    };
    const result = $calc(flattenElements_calc);
    return result;
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
