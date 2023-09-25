import { Signal, isSignal } from './signals/index.js';

/**
 * Flattens nested arrays and calls .value on signals. Removes null and undefined
 * @param children
 * @param callback
 * @returns
 */
export function flatten(
    children: JSX.Element,
    callback: (
        item: Exclude<
            JSX.Element,
            JSX.Element[] | Signal<JSX.Element> | null | undefined
        >,
    ) => void,
): void {
    if (children === null || children === undefined) {
        return;
    }

    if (Array.isArray(children)) {
        children.forEach((inner) => {
            flatten(inner, callback);
        });
    } else if (isSignal(children)) {
        flatten(children.value, callback);
    } else {
        callback(children);
    }
}
