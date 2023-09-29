export type FlattenedElement = Exclude<
    JSX.Element,
    JSX.Element[] | null | undefined
>;

/**
 * Flattens nested arrays and calls .value on signals. Removes null and undefined
 * @param children
 * @param callback
 * @returns
 */
export function flatten(
    children: JSX.Element,
    callback: (item: FlattenedElement) => void,
): void {
    if (children === null || children === undefined) {
        return;
    }

    if (Array.isArray(children)) {
        children.forEach((inner) => {
            flatten(inner, callback);
        });
    } else {
        callback(children);
    }
}
