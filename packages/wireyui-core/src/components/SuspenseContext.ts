import { Context } from '../context/Context.js';

export interface SuspenseContext {
    /**
     * Start displaying loaded fallback. Returns a cancellation function. Cancelling multiple times is safe.
     */
    startBlocking(): () => void;
    readonly count: number;
}

export const SuspenseContext = new Context<SuspenseContext>('SuspenseContext', {
    startBlocking: () => {
        throw new Error(
            'No SuspenseContext set, please wrap your element in a Suspense',
        );
    },
    get count(): number {
        throw new Error(
            'No SuspenseContext set, please wrap your element in a Suspense',
        );
    },
});
