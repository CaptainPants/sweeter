import type { ComponentInit, Props } from '../index.js';
import { calc, mutable, valueOf } from '../index.js';
import { subscribe } from '../signals/subscribe.js';

export interface AsyncProps<T> {
    callback: (abort: AbortSignal) => Promise<T>;
    children: (data: T) => JSX.Element;
}

// TODO: Suspense

export function Async<T>(
    props: Props<AsyncProps<T>>,
    init: ComponentInit,
): JSX.Element;
export function Async<T>(
    { callback, children }: Props<AsyncProps<T>>,
    init: ComponentInit,
): JSX.Element {
    const data = mutable<{ resolved: true; result: T } | { resolved: false }>({
        resolved: false,
    });

    async function load() {
        const result = await valueOf(callback)(abortController.signal);

        if (abortController.signal.aborted) {
            return; // don't store result if aborted
        }

        data.value = { resolved: true, result };
    }

    let abortController = new AbortController();
    load();

    const cleanupSubscriptionToProps = subscribe([callback, children], () => {
        abortController.abort();
        abortController = new AbortController();
        load();
    });

    init.onUnMount(() => {
        cleanupSubscriptionToProps?.();
        abortController.abort();
    });

    return calc(() => {
        if (data.value.resolved) {
            return valueOf(children)(data.value.result);
        } else {
            throw new Error('TODO: implement suspense');
        }
    });
}
