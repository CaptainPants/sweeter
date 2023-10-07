import { Context } from '../context/Context.js';

export interface SuspenseContextType {
    startBlocking(): () => void;
    readonly count: number;
}

export const SuspenseContext = new Context<SuspenseContextType>(
    'SuspenseContext',
    {
        startBlocking: () => {
            throw new Error(
                'No SuspenseContext set, please wrap your element in a Suspense',
            );
        },
        get count(): number {
            throw new Error(
                'No SuspenseContext set, please wrap your element in a Suspense',
            );
        }
    },
);
