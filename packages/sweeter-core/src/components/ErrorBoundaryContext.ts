import { Context } from '../context/Context.js';

export interface ErrorBoundaryContext {
    error(err: unknown): void;
}

export const ErrorBoundaryContext = new Context<ErrorBoundaryContext>(
    'ErrorBoundaryContext',
    {
        error(err) {
            throw new Error(
                'No ErrorBoundaryContext set, please wrap your element in an ErrorBoundary',
            );
        },
    },
);
