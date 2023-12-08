import type { ContextSnapshot } from '@captainpants/sweeter-core';
import { callAgainstErrorBoundary } from './callAgainstErrorBoundary.js';

function callbacks<T extends object>(name: string) {
    const map = new WeakMap<T, (() => void)[]>();

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
                map.delete(obj); // delete first in case we inadvertantly trigger a reentrant call

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
    contextSnapshot: ContextSnapshot,
    node: Node,
    callback: () => (() => void) | void,
): () => void {
    const inner = () => {
        const cleanup = callAgainstErrorBoundary(
            contextSnapshot,
            callback,
            undefined,
        );

        if (cleanup) {
            // TODO: we could add these to a set and remove them if the mount callback has been called,
            // but in practice we're not using the result of addMountedCallback anyway
            addUnMountedCallback(contextSnapshot, node, cleanup);
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
    contextSnapshot: ContextSnapshot,
    node: Node,
    callback: () => void,
): () => void {
    const inner = () =>
        callAgainstErrorBoundary(contextSnapshot, callback, undefined);
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

// TODO: we can make this stack-based to avoid recursion
export function announceMountedRecursive(node: Node): void {
    // reverse order
    announceChildrenMountedRecursive(node);

    // Call callbacks on current
    if (!isMounted.has(node)) {
        mountedCallbacks.execute(node);
        isMounted.add(node);
    }
}

export function announceUnMountedRecursive(node: Node): void {
    if (isMounted.has(node)) {
        unMountedCallbacks.execute(node);
        isMounted.delete(node);
    }

    // reverse order
    for (
        let current = node.lastChild;
        current;
        current = current.previousSibling
    ) {
        announceUnMountedRecursive(current);
    }
}
