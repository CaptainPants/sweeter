import {
    ComponentFaultContext,
    afterCalculationsComplete,
    type ContextSnapshot,
} from '@captainpants/sweeter-core';

function callbacks<T extends object>(name: string) {
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
        execute: (obj: T): void => {
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
                        console.warn(
                            'Error swallowed while invoking callback',
                            callback,
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

const mountedCallbacks = callbacks<Node>('mounted');
const unMountedCallbacks = callbacks<Node>('unmounted');
const isMounted = new WeakSet<Node>();

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
export function announceChildrenMountedRecursive(node: Node) {
    for (const child of node.childNodes) {
        announceMountedRecursive(child);
    }
}

/**
 * Note that this runs inside a afterCalculationsComplete.
 * @param node
 */
export function announceMountedRecursive(node: Node): void {
    // reverse order
    // TODO: we can make this stack-based to avoid recursion
    announceChildrenMountedRecursive(node);

    // Call callbacks on current
    if (!isMounted.has(node)) {
        afterCalculationsComplete(() => {
            mountedCallbacks.execute(node);
        });
        isMounted.add(node);
    }
}

/**
 * Note that this runs inside a afterCalculationsComplete.
 * @param node
 */
export function announceUnMountedRecursive(node: Node): void {
    if (isMounted.has(node)) {
        afterCalculationsComplete(() => {
            unMountedCallbacks.execute(node);
        });
        isMounted.delete(node);
    }

    // Reverse order
    // TODO: we can make this stack-based to avoid recursion
    for (
        let current = node.lastChild;
        current;
        current = current.previousSibling
    ) {
        announceUnMountedRecursive(current);
    }
}
