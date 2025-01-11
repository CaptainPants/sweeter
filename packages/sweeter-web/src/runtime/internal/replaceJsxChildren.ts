import {
    $insertLocation,
    type FlattenedElement,
} from '@captainpants/sweeter-core';
import { createLogger } from '@captainpants/sweeter-utilities';

import {
    announceChildrenMountedRecursive,
    announceUnMountedRecursive,
    isMounted,
} from './mounting.js';
import { isText } from './utility/isText.js';
import { removeSelfAndLaterSiblings } from './utility/removeSelfAndLaterSiblings.js';

const logger = createLogger($insertLocation(), replaceJsxChildren);

export function replaceJsxChildren(
    parentNode: Node,
    updated: FlattenedElement[],
): void {
    const newlyMountedNodes: Node[] = [];

    let insertBeforeIndex = 0;
    for (let child of updated) {
        if (isText(child)) {
            const asString = String(child);

            const insertBefore =
                parentNode.childNodes[insertBeforeIndex] ?? null;

            // The current node is text, update its content and move insertAt to next:
            if (insertBefore?.nodeType === Node.TEXT_NODE) {
                insertBefore.textContent = asString;
            }
            // The current element is something else, insert a text node
            else {
                child = document.createTextNode(String(child));
                parentNode.insertBefore(child, insertBefore);
            }
        } else {
            const elementAt = parentNode.childNodes[insertBeforeIndex] ?? null;

            // The updated node is next in the order
            if (elementAt === child) {
                // Do nothing, already in correct place
            }
            // The updated node is not in order or not in the doc, move it into the correct location
            else {
                parentNode.insertBefore(child, elementAt);
            }
        }
        ++insertBeforeIndex;

        // Nodes might have already been children of the parent, so we only include those that
        // don't have a parent
        if (child instanceof Node && !child.parentNode) {
            newlyMountedNodes.push(child);
        }
    }

    const removeNodeAndLaterSiblings = parentNode.childNodes[insertBeforeIndex];

    const parentMounted = isMounted(parentNode);

    // This items are being removed
    // Note that descendents are handled by the call to addJsxChildren that added them to their parent
    removeSelfAndLaterSiblings(removeNodeAndLaterSiblings, (removed) => {
        // This should do onUnMount recursively
        if (parentMounted) {
            announceUnMountedRecursive(logger, removed);
        }
    });

    if (parentMounted) {
        announceChildrenMountedRecursive(logger, parentNode);
    }
}
