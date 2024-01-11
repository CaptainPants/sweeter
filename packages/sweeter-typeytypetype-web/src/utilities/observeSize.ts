export type ObserveSizeCallback = (entry: ResizeObserverEntry) => void;

const callbackMap = new Map<Element, ObserveSizeCallback[]>();

// Lazy init this
let observer: ResizeObserver | undefined;

function getSingletonResizeObserver() {
    if (!observer) {
        observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const callbacks = callbackMap.get(entry.target);

                if (callbacks) {
                    for (const callback of callbacks) {
                        try {
                            callback(entry);
                        } catch (ex) {
                            // Swallow errors so that later callbacks are still invoked
                            console.log('Swallowed exception', ex);
                        }
                    }
                }
            }
        });
    }
    return observer;
}

export function observeSize(
    ele: Element,
    callback: ObserveSizeCallback,
): () => void {
    // observer is lazily created on first use
    const observer = getSingletonResizeObserver();

    let callbacks = callbackMap.get(ele);
    if (!callbacks) {
        callbacks = [];
        callbackMap.set(ele, callbacks);
    }

    callbacks.push(callback);

    // It is safe to call this more than once for a single element (https://drafts.csswg.org/resize-observer/#dom-resizeobserver-observe)
    observer.observe(ele);

    return () => {
        const callbacks = callbackMap.get(ele);

        if (!callbacks) {
            // shouldn't happen
            return;
        }

        const index = callbacks.indexOf(callback);
        if (index >= 0) {
            callbacks?.splice(index, 1);
        }

        // if there are no callbacks left, remove the map entry and stop observing the element
        if (callbacks.length == 0) {
            callbackMap.delete(ele);
            observer.unobserve(ele);
        }
    };
}

export function getObservedElementCount() {
    return callbackMap.size;
}
