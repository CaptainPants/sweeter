export type TraversedElement = Exclude<
    JSX.Element,
    JSX.Element[] | null | undefined
>;

/**
 * Flattens nested arrays and calls .value on signals. Removes null and undefined
 * @param children
 * @param callback
 * @returns
 */
export function traverse(
    children: JSX.Element,
    callback: (item: TraversedElement) => void,
): void {
    if (children === null || children === undefined) {
        return;
    }

    if (Array.isArray(children)) {
        children.forEach((inner) => {
            traverse(inner, callback);
        });
    } else {
        callback(children);
    }
}
