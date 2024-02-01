import { Context } from '../context/Context.js';

export interface ErrorBoundaryContext {
    reportError(err: unknown): void;
}

export const ErrorBoundaryContext = new Context<ErrorBoundaryContext>(
    'ErrorBoundaryContext',
    {
        reportError(err) {
            throw new Error(
                `No ErrorBoundaryContext set, please wrap your element in an ErrorBoundary. Original: ${String(
                    err,
                )}`,
            );
        },
    },
);
