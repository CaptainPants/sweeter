import {
    type ContextSnapshot,
    flattenElements,
    ComponentFaultContext,
    SignalState,
    type FlattenedElement,
    afterCalculationsComplete,
    listenWhileNotCollected,
} from '@captainpants/sweeter-core';
import {
    announceChildrenMountedRecursive,
    announceUnMountedRecursive,
    isMounted,
} from './mounting.js';
import { isText } from './utility/isText.js';
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
        } else if (typeof child === 'boolean') {
            child = document.createTextNode(''); // This is to support <bool> || thing(), <bool> && thing() syntax
        }

        newlyMountedNodes.push(child);
        parentNode.appendChild(child);
    }

    // ==== LISTENERS ====

    listenWhileNotCollected(
        parentNode,
        flattenedChildrenSignal,
        (newState: SignalState<FlattenedElement[]>) => {
            afterCalculationsComplete(() => {
                try {
                    const updatedChildren = SignalState.getValue(newState); // newState might be an error state
                    replaceJsxChildren(parentNode, updatedChildren);
                } catch (err) {
                    const faultContext = getContext(ComponentFaultContext);
                    faultContext.reportFaulted(err);
                }
            });
        },
    );

    // ==== MOUNT HANDLERS ====

    if (isMounted(parentNode)) {
        // Note that these functions use afterCalculationsComplete so won't cause the nodelist to change
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
            // Note that these functions use afterCalculationsComplete so won't cause the nodelist to change
            announceUnMountedRecursive(current);
        }
    };
}
