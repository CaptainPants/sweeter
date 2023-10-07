import { calc, mutable, valueOf } from '../index.js';
import type { ComponentInit, Props } from '../types.js';
import { ErrorBoundaryContext } from './ErrorBoundaryContext.js';

export interface ErrorBoundaryProps {
    children: () => JSX.Element;
    renderError: (error: unknown) => JSX.Element;
}

// TODO: how to clear the error boundary??

export function ErrorBoundary(
    props: Props<ErrorBoundaryProps>,
    init: ComponentInit,
): JSX.Element;
export function ErrorBoundary(
    { renderError, children }: Props<ErrorBoundaryProps>,
    init: ComponentInit,
): JSX.Element {
    const error = mutable<undefined | { error: unknown }>(undefined);

    return ErrorBoundaryContext.invoke(
        {
            error(err) {
                error.value = { error: err };
            }
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
                    return valueOf(children)();
                } catch (ex) {
                    // This would only happen if the method itself
                    // throws, as the rendering functions should be
                    // invoking the boundary directory using 
                    // ErrorBoundaryContext
                    return valueOf(renderError)(ex);
                }
            };

            return calc(errorBoundaryCalculation);
        }
    )
}
