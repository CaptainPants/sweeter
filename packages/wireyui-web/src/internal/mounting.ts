const mountedCallbacks = new WeakMap<Node, () => void>();
const unMountedCallbacks = new WeakMap<Node, () => void>();

export function setMountedCallback(node: Node, callback: () => void) {
    mountedCallbacks.set(node, callback);
}

export function setUnMountedCallback(node: Node, callback: () => void) {
    unMountedCallbacks.set(node, callback);
}

export function mounted(nodeList: NodeList): void {
    for (const node of nodeList) {
        const callback = mountedCallbacks.get(node);
        if (callback) {
            try {
                callback();
            } catch (ex) {
                console.warn(
                    'Error swallowed while invoking handler',
                    callback,
                    ex,
                );
            }
        }
    }
}

export function unmounted(nodeList: NodeList): void {
    for (const node of nodeList) {
        const callback = unMountedCallbacks.get(node);
        if (callback) {
            try {
                callback();
            } catch (ex) {
                console.warn(
                    'Error swallowed while invoking handler',
                    callback,
                    ex,
                );
            }
        }
    }
}
