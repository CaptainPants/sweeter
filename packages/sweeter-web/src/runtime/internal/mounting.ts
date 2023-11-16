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
                map.delete(obj);
            }
        },
        __map: map,
    } as const;
}

const mountedCallbacks = callbacks<Node>('mounted');
const unMountedCallbacks = callbacks<Node>('unmounted');
const isMounted = new WeakSet<Node>();

export function addMountedCallback(node: Node, callback: () => void) {
    mountedCallbacks.add(node, callback);
}
export function addUnMountedCallback(node: Node, callback: () => void) {
    unMountedCallbacks.add(node, callback);
}
export function removeMountedCallback(node: Node, callback: () => void) {
    mountedCallbacks.remove(node, callback);
}
export function removeUnMountedCallback(node: Node, callback: () => void) {
    unMountedCallbacks.remove(node, callback);
}

/**
 * Note that this is safe to call on elements that might already have mounted,
 * as each has a flag to detect remounts.
 * @param node
 */
export function announceChildrenMountedRecursive(node: Node) {
    // reverse order
    for (
        let current = node.lastChild;
        current;
        current = current.previousSibling
    ) {
        announceMountedRecursive(current);
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

    for (const child of node.childNodes) {
        announceUnMountedRecursive(child);
    }
}
