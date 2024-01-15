import {
    addExplicitStrongReference,
    flattenElements,
} from '@captainpants/sweeter-core';
import {
    announceChildrenMountedRecursive,
    announceUnMountedRecursive,
} from './mounting.js';
import { isText } from './utility/isText.js';
import { isInDocument } from './utility/isInDocument.js';
import { type WebRuntime } from '../types.js';
import { replaceJsxChildren } from './replaceJsxChildren.js';

export function addJsxChildren(
    parent: Node,
    children: JSX.Element,
    webRuntime: WebRuntime,
): () => void {
    const parentInDocument = isInDocument(parent);
    const flattenedChildrenSignal = flattenElements(children);
    const original = flattenedChildrenSignal.peek();

    const newlyMountedNodes: Node[] = [];

    for (let child of original) {
        if (isText(child)) {
            // TODO: reuse text nodes here
            child = document.createTextNode(String(child));
        }

        newlyMountedNodes.push(child);
        parent.appendChild(child);
    }

    const onChange = () => {
        replaceJsxChildren(parent, flattenedChildrenSignal.peek(), webRuntime);
    };

    flattenedChildrenSignal.listen(onChange, false);

    // Callback lifetime linked to the parent Node
    addExplicitStrongReference(parent, onChange);

    if (parentInDocument) {
        announceChildrenMountedRecursive(parent);
    }

    return () => {
        for (
            let current = parent.lastChild;
            current;
            current = parent.lastChild
        ) {
            current.remove();
            announceUnMountedRecursive(current);
        }
    };
}
