import {
    $insertLocation,
    ComponentFaultContext,
    afterCalculationsComplete,
    type ContextSnapshot,
} from '@captainpants/sweeter-core';
import { Logger } from '@captainpants/sweeter-utilities';

function nodeAssociatedCallbacks<T extends object>(name: string) {
    const map = new WeakMap<T, (() => void)[]>();
    const running = new WeakSet<T>();

    return {
        name,
        add: (obj: T, callback: () => void): void => {
            const found = map.get(obj);
            if (found) {
                found.push(callback);
            } else {
                map.set(obj, [callback]);
            }
        },
        remove: (obj: T, callback: () => void): boolean => {
            const found = map.get(obj);
            if (found) {
                const index = found.indexOf(callback);
                if (index >= 0) {
                    found.splice(index, 1);
                    return true;
                }
            }
            return false;
        },
        execute: (logger: Logger, obj: T): void => {
            const callbacks = map.get(obj);
            if (callbacks) {
                if (running.has(obj)) {
                    // e-entrant calls detected
                    return;
                }

                running.add(obj); // delete first in case we inadvertantly trigger a reentrant call

                for (const callback of callbacks) {
                    try {
                        callback();
                    } catch (ex) {
                        logger.warning
                            .formatted`Error swallowed while invoking callback ${callback.name}`(
                            ex,
                        );
                    }
                }

                running.delete(obj);
            }
        },
        __map: map,
    } as const;
}

const mountedCallbacks = nodeAssociatedCallbacks<Node>('mounted');
const unMountedCallbacks = nodeAssociatedCallbacks<Node>('unmounted');
const isMountedMap = new WeakSet<Node>();

/**
 * Add a callback to be called when the node is added to the document.
 *
 * The returned function removes the callback. Note that this will not prevent any existing cleanup functions from firing.
 * @param contextSnapshot
 * @param node
 * @param callback
 */
export function addMountedCallback(
    getContext: ContextSnapshot,
    node: Node,
    callback: () => (() => void) | void,
): () => void {
    const inner = () => {
        let cleanup: (() => void) | void;
        try {
            cleanup = callback();
        } catch (err) {
            const faultContext = getContext(ComponentFaultContext);
            faultContext.reportFaulted(err);
            return;
        }

        if (cleanup) {
            addUnMountedCallback(getContext, node, cleanup);
        }
    };
    mountedCallbacks.add(node, inner);
    return () => mountedCallbacks.remove(node, inner);
}
/**
 * Add a callback to be called when the node is removed from the document.
 *
 * The returned function removes the callback.
 * @param contextSnapshot
 * @param node
 * @param callback
 */
export function addUnMountedCallback(
    getContext: ContextSnapshot,
    node: Node,
    callback: () => void,
): () => void {
    const inner = () => {
        try {
            callback();
        } catch (err) {
            const faultContext = getContext(ComponentFaultContext);
            faultContext.reportFaulted(err);
        }
    };
    unMountedCallbacks.add(node, inner);
    return () => unMountedCallbacks.remove(node, inner);
}

/**
 * Note that this is safe to call on elements that might already have mounted,
 * as each has a flag to detect remounts.
 * @param node
 */
export function announceChildrenMountedRecursive(logger: Logger, node: Node) {
    for (const child of node.childNodes) {
        announceMountedRecursive(logger, child);
    }
}

/**
 * Note that this runs inside a afterCalculationsComplete.
 * @param node
 */
export function announceMountedRecursive(logger: Logger, node: Node): void {
    // reverse order
    // TODO: we can make this stack-based to avoid recursion
    announceChildrenMountedRecursive(logger, node);

    // Call callbacks on current
    if (!isMountedMap.has(node)) {
        afterCalculationsComplete(() => {
            mountedCallbacks.execute(logger, node);
        });
        isMountedMap.add(node);
    }
}

/**
 * Note that this runs inside a afterCalculationsComplete.
 * @param node
 */
export function announceUnMountedRecursive(logger: Logger, node: Node): void {
    if (isMountedMap.has(node)) {
        afterCalculationsComplete(() => {
            unMountedCallbacks.execute(logger, node);
        });
        isMountedMap.delete(node);
    }

    // Reverse order
    // TODO: we can make this stack-based to avoid recursion
    for (
        let current = node.lastChild;
        current;
        current = current.previousSibling
    ) {
        announceUnMountedRecursive(logger, current);
    }
}

export function isMounted(node: Node) {
    return isMountedMap.has(node);
}
