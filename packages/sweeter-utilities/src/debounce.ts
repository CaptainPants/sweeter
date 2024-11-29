import { assertNotNullOrUndefined } from './assertNotNullOrUndefined.js';

export interface DebouncedCallback<
    TCallback extends (...args: readonly unknown[]) => void,
> {
    (...args: Parameters<TCallback>): void;
    callback: TCallback;
    timeout: number;
    /** Cancel a debounce in progress. */
    cancel: () => void;
    /** If there is a debounce in progress, cancel it and immediately call the callback. Otherwise do nothing. */
    flush: () => void;
}

export function debounce<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TCallback extends (...args: readonly any[]) => void,
>(timeout: number, callback: TCallback): DebouncedCallback<TCallback> {
    const { setTimeout, clearTimeout } = globalThis;

    let id: ReturnType<typeof globalThis.setTimeout> | null = null;
    let lastArgs: Parameters<TCallback> | null = null;

    const returnedCallback = (...args: Parameters<TCallback>): void => {
        if (id !== null) {
            clearTimeout(id);
            id = null;
        }

        if (timeout > 0) {
            id = setTimeout(() => {
                returnedCallback.callback(...args);
            }, returnedCallback.timeout);
        } else {
            // immediate call
            returnedCallback.callback(...args);
        }

        lastArgs = args;
    };

    returnedCallback.callback = callback;
    returnedCallback.timeout = timeout;
    returnedCallback.cancel = () => {
        if (id !== null) {
            clearTimeout(id);
            id = null;
        }
    };
    returnedCallback.flush = () => {
        if (id !== null) {
            assertNotNullOrUndefined(lastArgs);
            returnedCallback.callback(...lastArgs);
            clearTimeout(id);
            id = null;
        }
    };

    return returnedCallback;
}
