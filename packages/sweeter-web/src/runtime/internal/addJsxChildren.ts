import {
    type ContextSnapshot,
    addExplicitStrongReference,
    flattenElements,
    ComponentFaultContext,
    type SignalState,
    getSignalValueFromState,
    type FlattenedElement,
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
    getContext: ContextSnapshot,
    parentNode: Node,
    children: JSX.Element,
    webRuntime: WebRuntime,
): () => void {
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

    // ==== LISTENERS ====

    const onChange = (
        _: SignalState<FlattenedElement[]>,
        newState: SignalState<FlattenedElement[]>,
    ) => {
        try {
            const updatedChildren = getSignalValueFromState(newState); // newState might be an error state
            replaceJsxChildren(parentNode, updatedChildren);
        } catch (err) {
            const faultContext = getContext(ComponentFaultContext);
            faultContext.reportFaulted(err);
        }
    };

    flattenedChildrenSignal.listen(onChange /* strong reference */);

    // Callback lifetime linked to the parent Node
    addExplicitStrongReference(parentNode, flattenedChildrenSignal);

    // ==== MOUNT HANDLERS ====

    if (isInDocument(parentNode)) {
        // TODO: this could cause elements to become unmounted - will that explode things?
        announceChildrenMountedRecursive(parentNode);
    }

    // ==== CLEANUP ====

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
