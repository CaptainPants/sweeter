import {
    addExplicitStrongReference,
    flattenElements,
} from '@captainpants/wireyui-core';
import {
    announceChildrenMountedRecursive,
    announceMountedRecursive,
    announceUnMountedRecursive,
} from './mounting.js';
import { removeSelfAndLaterSiblings } from './utility/removeSelfAndLaterSiblings.js';
import { isText } from './utility/isText.js';
import { isInDocument } from './utility/isInDocument.js';

export function addJsxChildren(
    parent: Node,
    children: JSX.Element,
): () => void {
    const parentInDocument = isInDocument(parent);
    const flattenedChildrenSignal = flattenElements(children);
    const original = flattenedChildrenSignal.peek();

    let newlyMountedNodes: Node[] = [];

    for (let child of original) {
        if (isText(child)) {
            child = document.createTextNode(String(child));
        }

        newlyMountedNodes.push(child);
        parent.appendChild(child);
    }

    const onChange = () => {
        const parentInDocument = isInDocument(parent);
        const updated = flattenedChildrenSignal.peek();
        const sentinel = parent.firstChild;

        newlyMountedNodes = [];

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
            if (current.ownerDocument && isInDocument(current)) {
                announceMountedRecursive(current);
            }
        }

        // This items are being removed
        // Note that descendents are handled by the call to addJsxChildren that added them to their parent
        removeSelfAndLaterSiblings(sentinel, (removed) => {
            // This should do onUnMount recursively
            if (!isInDocument(removed)) {
                announceUnMountedRecursive(removed);
            }
        });

        if (parentInDocument) {
            announceChildrenMountedRecursive(parent);
        }
    };

    flattenedChildrenSignal.listen(onChange, false);

    // Callback lifetime linked to the parent Node
    addExplicitStrongReference(parent, onChange);

    if (parentInDocument) {
        announceChildrenMountedRecursive(parent);
    }

    return () => {
        for (
            let current = parent.firstChild;
            current;
            current = parent.firstChild
        ) {
            current.remove();
            announceUnMountedRecursive(current);
        }
    };
}
