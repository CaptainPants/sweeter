import {
    addStrongReference,
    flattenElements,
} from '@captainpants/wireyui-core';

export function addJsxChildren(parent: Node, children: JSX.Element): void {
    const flattened = flattenElements(children);
    const original = flattened.peek();

    for (let child of original) {
        if (isText(child)) {
            child = document.createTextNode(String(child));
        }

        parent.insertBefore(child, null);
    }

    const onChange = () => {
        const updated = flattened.peek();
        const sentinel = parent.firstChild;

        for (let child of updated) {
            if (isText(child)) {
                child = document.createTextNode(String(child));
            }

            parent.insertBefore(child, sentinel);
        }

        // This items are being removed
        removeSelfAndLaterSiblings(sentinel, (removed) => {
            // This should do onUnMount recursively
            console.log('Removed', removed);
        });
    };

    flattened.listen(onChange, false);

    // Callback lifetime linked to the parent Node
    addStrongReference(parent, onChange);
}

function isText(value: unknown): value is string | number | boolean {
    const type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
}

function removeSelfAndLaterSiblings(
    child: ChildNode | null,
    callback: (node: ChildNode) => void,
) {
    if (!child) return;

    const parent = child.parentNode;
    if (!parent) return;

    // this might be null
    const lastChildAfterRemovals = child.previousSibling;

    while (parent.lastChild && parent.lastChild !== lastChildAfterRemovals) {
        callback(parent.lastChild);
        parent.lastChild.remove();
    }
}
