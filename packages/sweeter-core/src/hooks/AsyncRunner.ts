import { type ComponentInit, type HookFactory } from '../types.js';
import { $mutable } from '../signals/$mutable.js';
import { DOMException } from '@captainpants/sweeter-utilities';
import { type Signal } from '../signals/types.js';

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

export const AsyncRunnerHook: HookFactory<[], AsyncRunner> = (
    init: ComponentInit,
) => {
    const running = $mutable(false);
    let currentAbortController: AbortController | null = null;

    const abort = () => {
        currentAbortController?.abort();
        currentAbortController = null;
    };

    return {
        running,
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
