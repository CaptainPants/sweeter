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
    parentNode: Node,
    children: JSX.Element,
    webRuntime: WebRuntime,
): () => void {
    const parentInDocument = isInDocument(parentNode);
    const flattenedChildrenSignal = flattenElements(children);
    const original = flattenedChildrenSignal.peek();

    const newlyMountedNodes: Node[] = [];

    for (let child of original) {
        if (isText(child)) {
            // TODO: reuse text nodes here
            child = document.createTextNode(String(child));
        }

        newlyMountedNodes.push(child);
        parentNode.appendChild(child);
    }

    const onChange = () => {
        replaceJsxChildren(parentNode, flattenedChildrenSignal.peek());
    };

    flattenedChildrenSignal.listen(onChange, false);

    // Callback lifetime linked to the parent Node
    addExplicitStrongReference(parentNode, onChange);

    if (parentInDocument) {
        announceChildrenMountedRecursive(parentNode);
    }

    return () => {
        for (
            let current = parentNode.lastChild;
            current;
            current = parentNode.lastChild
        ) {
            current.remove();
            announceUnMountedRecursive(current);
        }
    };
}
