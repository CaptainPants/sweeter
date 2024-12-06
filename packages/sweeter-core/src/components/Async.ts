import {
    type ComponentInit,
    type MightBeSignal,
    type PropertiesMightBeSignals,
} from '../types.js';
import { type Signal } from '../signals/types.js';
import { $calc } from '../signals/$calc.js';
import { $mutable } from '../signals/$mutable.js';
import { $val } from '../signals/$val.js';
import { SuspenseContext } from './SuspenseContext.js';
import { getRuntime } from '../runtime/Runtime.js';

export type AsyncProps<T> = PropertiesMightBeSignals<{
    loadData: (abort: AbortSignal) => Promise<T>;
    /**
     * Note that this is called inside a $calc, so signals can be subscribed without additionally wrapping in another $calc.
     * @param data
     * @returns
     */
    children: (data: Signal<T>) => JSX.Element;
}>;

export function Async<T>(
    props: AsyncProps<T>,
    init: ComponentInit,
): JSX.Element;
export function Async<T>(
    { loadData: callback, children }: AsyncProps<T>,
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

    const resolution = $calc(() => data.value.resolution); // So that our result $calc can subscribe to just the resolution type, not the value/error

    const latestResult: Signal<T> = $calc<T>(() => {
        if (data.value.resolution === 'SUCCESS') {
            return data.value.result;
        } else if (data.value.resolution === 'ERROR') {
            throw data.value.error;
        } else if (!latestResult.inited) {
            throw new TypeError(
                'Incorrectly using the value Signal in Async before it has a result.',
            );
        } else {
            // Keep most recent value
            return latestResult.peek();
        }
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
        signal.addEventListener('abort', function abortCallback() {
            revertSuspenseBlock();
        });

        try {
            const result = await callback(signal);

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

    init.trackSignals(
        [callback],
        function Async_subscribeToChanges([callback]) {
            const abortController = new AbortController();
            reload(callback, abortController.signal);

            return () => {
                abortController.abort();
            };
        },
    );

    return $calc(() => {
        if (resolution.value === 'LOADING') {
            // Suspense should be showing
            return undefined;
        } else {
            return $val(children)(latestResult);
        }
    });
}

/**
 *
 * @param loadData
 * @param render
 * @returns
 */
export function $async<T>(
    loadData: MightBeSignal<(abort: AbortSignal) => Promise<T>>,
    /**
     * Note that this is called inside a $calc, so signals can be subscribed without additionally wrapping in another $calc.
     */
    render: MightBeSignal<(data: Signal<T>) => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(Async<T>, { loadData, children: render });
}
