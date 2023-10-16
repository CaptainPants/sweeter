import { $calc, $mutable, valueOf } from '../signals/index.js';
import type { Component } from '../types.js';
import { ErrorBoundaryContext } from './ErrorBoundaryContext.js';

export interface ErrorBoundaryProps {
    children: () => JSX.Element;
    renderError: (error: unknown) => JSX.Element;
}

// TODO: how to clear the error boundary??

export const ErrorBoundary: Component<ErrorBoundaryProps> = ({
    renderError,
    children,
}) => {
    const error = $mutable<undefined | { error: unknown }>(undefined);

    return ErrorBoundaryContext.invoke(
        {
            error(err) {
                error.value = { error: err };
            },
        },
        () => {
            const errorBoundaryCalculation = () => {
                // TODO: having two paths here seems weird
                // but having a side effect from calling renderError
                // would also be gross
                if (error.value) {
                    return valueOf(renderError)(error.value.error);
                }

                try {
                    const res = valueOf(children)();
                    // If the result is a signal we need to subscribe
                    // and get its value - so that any errors stored
                    // in a calculated signal are caught by this try/
                    // catch.
                    return valueOf(res);
                } catch (ex) {
                    // This would only happen if the method itself
                    // throws, as the rendering functions should be
                    // invoking the boundary directory using
                    // ErrorBoundaryContext
                    return valueOf(renderError)(ex);
                }
            };

            return $calc(errorBoundaryCalculation);
        },
    );
};
