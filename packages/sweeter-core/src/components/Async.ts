import type { ComponentInit, SignalifyProps } from '../types.js';
import { $calc, $mutable, valueOf } from '../signals/index.js';
import { SuspenseContext } from './SuspenseContext.js';

export type AsyncProps<T> = SignalifyProps<{
    callback: (abort: AbortSignal) => Promise<T>;
    children: (data: T) => JSX.Element;
}>;

export function Async<T>(
    props: AsyncProps<T>,
    init: ComponentInit,
): JSX.Element;
export function Async<T>(
    { callback, children }: AsyncProps<T>,
    init: ComponentInit,
): JSX.Element {
    const suspenseContext = SuspenseContext.getCurrent();

    const data = $mutable<
        | { resolution: 'LOADING' }
        | { resolution: 'SUCCESS'; result: T }
        | { resolution: 'ERROR'; error: unknown }
    >({
        resolution: 'LOADING',
    });

    async function reload(
        callback: (abort: AbortSignal) => Promise<T>,
        signal: AbortSignal,
    ) {
        // Consider this step might need to be optional
        if (data.value.resolution !== 'LOADING') {
            data.value = { resolution: 'LOADING' };
        }

        const revertSuspenseBlock = suspenseContext.startBlocking();
        signal.addEventListener('abort', () => {
            revertSuspenseBlock();
        });

        try {
            const result = await valueOf(callback)(signal);

            if (signal.aborted) {
                return; // don't store result if aborted
            }

            data.value = { resolution: 'SUCCESS', result };
        } catch (ex) {
            if (signal.aborted) {
                return; // don't store result if aborted
            }

            data.value = { resolution: 'ERROR', error: ex };
        } finally {
            revertSuspenseBlock();
        }
    }

    init.subscribeToChanges(
        [callback],
        ([callback]) => {
            const abortController = new AbortController();
            reload(callback, abortController.signal);

            return () => {
                abortController.abort();
            };
        },
        true,
    );

    return $calc(() => {
        if (data.value.resolution === 'LOADING') {
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
