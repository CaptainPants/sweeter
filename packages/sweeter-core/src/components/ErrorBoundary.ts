import {
    $calc,
    $mutable,
    $val,
    isCalculationRunning,
} from '../signals/index.js';
import { type Component, type PropertiesMightBeSignals } from '../types.js';
import { ErrorBoundaryContext } from './ErrorBoundaryContext.js';

export type ErrorBoundaryProps = PropertiesMightBeSignals<{
    children: () => JSX.Element;
    renderError: (error: unknown) => JSX.Element;
}>;

// TODO: how to clear the error boundary??

export const ErrorBoundary: Component<ErrorBoundaryProps> = ({
    renderError,
    children,
}) => {
    const error = $mutable<undefined | { error: unknown }>(undefined);

    return ErrorBoundaryContext.invokeWith(
        {
            error(err) {
                // If this error occurs during a 'calculation', the result of the calculation should be an error.
                if (isCalculationRunning()) {
                    console.error("This shouldn't happen");
                    throw err;
                } else {
                    error.value = { error: err };
                }
            },
        },
        () => {
            const errorBoundaryCalculation = () => {
                // TODO: having two paths here seems weird
                // but having a side effect from calling renderError
                // would also be gross
                if (error.value) {
                    return $val(renderError)(error.value.error);
                }

                try {
                    const res = $val(children)();
                    // If the result is a signal we need to subscribe
                    // and get its value - so that any errors stored
                    // in a calculated signal are caught by this try/
                    // catch.
                    return $val(res);
                } catch (ex) {
                    // This would only happen if the method itself
                    // throws, as the rendering functions should be
                    // invoking the boundary directory using
                    // ErrorBoundaryContext
                    return $val(renderError)(ex);
                }
            };

            return $calc(errorBoundaryCalculation);
        },
    );
};
