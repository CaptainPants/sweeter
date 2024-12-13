import { type ComponentInit, type HookFactory } from '../types.js';
import { $mutable } from '../signals/$mutable.js';
import { type Signal } from '../signals/types.js';
import { $derive } from '../signals/$derive.js';

export interface AsyncRunnerHookOptions {
    abortOnUnMount?: boolean;
}

export interface AsyncCallbackOptions {
    abortSignal?: AbortSignal;
}

export interface AsyncRunner {
    running: Signal<boolean>;
    abort(): void;
    run(
        callback: (abort: AbortSignal) => Promise<void>,
        options?: AsyncCallbackOptions,
    ): Promise<void>;
}

export const AsyncRunnerHook: HookFactory<
    [options?: AsyncRunnerHookOptions | undefined],
    AsyncRunner
> = (init: ComponentInit, { abortOnUnMount } = {}) => {
    const running = $mutable(false);
    let currentAbortController: AbortController | null = null;

    const abort = () => {
        currentAbortController?.abort();
        currentAbortController = null;
    };

    if (abortOnUnMount) {
        init.onUnMount(abort);
    }

    return {
        // Readonly version of running .value
        running: $derive(() => running.value),
        abort,
        run: async (
            func: (abort: AbortSignal) => Promise<void>,
            { abortSignal }: AsyncCallbackOptions = {},
        ) => {
            const abort = new AbortController();

            function reset(): void {
                // If someone hasn't started a new run,
                // reset the 'current' state to null
                if (currentAbortController === abort) {
                    currentAbortController = null;
                }
            }

            // Abort the existing run if it exists
            // This should happen before the first await
            if (currentAbortController?.abort !== undefined) {
                currentAbortController.abort();
            }

            abort.signal.addEventListener('abort', () => {
                reset();
            });

            // Chain the incoming signal onto the new one we're creating
            if (abortSignal !== undefined) {
                abortSignal.addEventListener('abort', () => {
                    abort.abort();
                });
            }

            currentAbortController = abort;

            try {
                // == This is the first await call ==
                const result = await func(abort.signal);

                // Don't return if aborted
                // throwIfAborted seems to be absent in hermes
                if (abort.signal.aborted) {
                    throw (
                        abort.signal.reason ??
                        // I think this is redundent, as an undefined reason should see an AbortError provided as the reason
                        new DOMException('Aborted', 'AbortError')
                    );
                }

                return result;
            } finally {
                reset();
            }
        },
    };
};
