import {
    addStrongReference,
    flattenElements,
} from '@captainpants/wireyui-core';
import { mounted, unMounted } from './mounting.js';

export function addJsxChildren(
    parent: Node,
    children: JSX.Element,
): () => void {
    const flattened = flattenElements(children);
    const original = flattened.peek();

    const mountedNodes: Node[] = [];

    for (let child of original) {
        if (isText(child)) {
            child = document.createTextNode(String(child));
        }

        parent.appendChild(child);
        mountedNodes.push(child);
    }

    // Go through added nodes in reverse order and call any mount callbacks
    for (
        let current = mountedNodes.pop();
        current;
        current = mountedNodes.pop()
    ) {
        mounted(current);
    }

    const onChange = () => {
        const updated = flattened.peek();
        const sentinel = parent.firstChild;

        const newlyMountedNodes: Node[] = [];

        for (let child of updated) {
            if (isText(child)) {
                child = document.createTextNode(String(child));
            }

            // Nodes might have already been children of the parent, so we only include those that
            // don't have a parent
            if (!child.parentNode) {
                newlyMountedNodes.push(child);
            }

            parent.insertBefore(child, sentinel);
        }

        // Go through added nodes in reverse order and call any mount callbacks
        for (
            let current = newlyMountedNodes.pop();
            current;
            current = newlyMountedNodes.pop()
        ) {
            mounted(current);
        }

        // This items are being removed
        removeSelfAndLaterSiblings(sentinel, (removed) => {
            // This should do onUnMount recursively
            unMounted(removed);
        });
    };

    flattened.listen(onChange, false);

    // Callback lifetime linked to the parent Node
    addStrongReference(parent, onChange);

    return () => {
        for (
            let current = parent.lastChild;
            current;
            current = parent.lastChild
        ) {
            current.remove();
            unMounted(current);
        }
    };
}

function isText(value: unknown): value is string | number | boolean {
    const type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
}

/**
 *
 * @param child
 * @param afterRemoveCallback called immediately prior to removing a Node
 * @returns
 */
function removeSelfAndLaterSiblings(
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
