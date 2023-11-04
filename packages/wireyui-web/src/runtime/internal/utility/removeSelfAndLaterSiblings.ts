/**
 *
 * @param child
 * @param afterRemoveCallback called immediately prior to removing a Node
 * @returns
 */
export function removeSelfAndLaterSiblings(
    child: ChildNode | null,
    afterRemoveCallback: (node: ChildNode) => void,
) {
    if (!child) return;

    const parent = child.parentNode;
    if (!parent) return;

    // this might be null
    const lastChildAfterRemovals = child.previousSibling;

    for (
        let current = parent.lastChild;
        current && current !== lastChildAfterRemovals;
        current = parent.lastChild
    ) {
        current.remove();
        afterRemoveCallback(current);
    }
}
