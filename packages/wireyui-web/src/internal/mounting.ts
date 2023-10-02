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
    } as const;
}

const mountedCallbacks = callbacks<Node>('mounted');
const unmountedCallbacks = callbacks<Node>('unmounted');

export function addMounted(node: Node, callback: () => void) {
    mountedCallbacks.add(node, callback);
}
export function addUnMounted(node: Node, callback: () => void) {
    unmountedCallbacks.add(node, callback);
}

// TODO: we can make this stack-based to avoid recursion
export function mounted(nodeList: NodeList): void {
    for (const node of nodeList) {
        mountedCallbacks.execute(node);

        mounted(node.childNodes);
    }
}

export function unMounted(nodeList: NodeList): void {
    for (const node of nodeList) {
        unMounted(node.childNodes);

        unmountedCallbacks.execute(node);
    }
}
