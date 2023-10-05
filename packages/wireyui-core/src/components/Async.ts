import type { ComponentInit, Props } from '../index.js';
import { calc, mutable, valueOf } from '../index.js';
import { subscribe } from '../signals/subscribe.js';
import { SuspenseContext } from './internal/SuspenseContext.js';

export interface AsyncProps<T> {
    callback: (abort: AbortSignal) => Promise<T>;
    children: (data: T) => JSX.Element;
}

export function Async<T>(
    props: Props<AsyncProps<T>>,
    init: ComponentInit,
): JSX.Element;
export function Async<T>(
    { callback, children }: Props<AsyncProps<T>>,
    init: ComponentInit,
): JSX.Element {
    const suspenseContext = SuspenseContext.getCurrent();

    const data = mutable<
        | { resolution: 'INITIAL' }
        | { resolution: 'SUCCESS'; result: T }
        | { resolution: 'ERROR'; error: unknown }
    >({
        resolution: 'INITIAL',
    });

    let abortController: AbortController | undefined;

    async function reload() {
        // kill previous run
        abortController?.abort();

        abortController = new AbortController();
        const revertSuspenseBlock = suspenseContext.startBlocking();
        abortController.signal.addEventListener('abort', () => {
            revertSuspenseBlock();
        });

        try {
            const result = await valueOf(callback)(abortController.signal);

            if (abortController.signal.aborted) {
                return; // don't store result if aborted
            }

            data.value = { resolution: 'SUCCESS', result };
        } catch (ex) {
            if (abortController.signal.aborted) {
                return; // don't store result if aborted
            }

            data.value = { resolution: 'ERROR', error: ex };
        } finally {
            revertSuspenseBlock();
        }
    }

    reload();

    const cleanupSubscriptionToProps = subscribe([callback, children], () => {
        reload();
    });

    init.onUnMount(() => {
        cleanupSubscriptionToProps?.();
        abortController?.abort();
    });

    return calc(() => {
        if (data.value.resolution === 'INITIAL') {
            // Suspense should be showing
            return undefined;
        } else {
            if (data.value.resolution === 'SUCCESS') {
                return valueOf(children)(data.value.result);
            } else if (data.value.resolution === 'ERROR') {
                throw data.value.error;
            } else {
                throw new Error('Unexpected resolution');
            }
        }
    });
}
