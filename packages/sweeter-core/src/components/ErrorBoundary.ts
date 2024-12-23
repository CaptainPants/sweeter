import { flattenElements } from '../utility/flattenElements.js';
import { $derived } from '../signals/$derived.js';
import { $val } from '../signals/$val.js';
import { isSignal } from '../signals/isSignal.js';
import { type Signal } from '../signals/types.js';
import { type Component, type PropertiesMightBeSignals } from '../types.js';

export type ErrorBoundaryProps = PropertiesMightBeSignals<{
    renderError: (error: unknown) => JSX.Element;
}> & {
    /**
     * We don't take a constant as that defeats the purpose of an ErrorBoundary, but it can be the result of a function call or a signal.
     *
     * Note that a function here will be wrapped in a $derived.
     */
    children: (() => JSX.Element) | Signal<JSX.Element>;
};

export const ErrorBoundary: Component<ErrorBoundaryProps> = ({
    renderError,
    children,
}) => {
    const childrenSignal = isSignal(children) ? children : $derived(children);

    // Calls .value on any signals, which should cause the catch to trigger
    const flattennedChildrenSignal = $derived(() => {
        const flattened = flattenElements(childrenSignal);
        return flattened.value;
    });

    const errorBoundaryCalculation = () => {
        // Doing this so that the result of the signal is an error if any child signals are errors

        try {
            // If the result is a signal we need to subscribe
            // and get its value - so that any errors stored
            // in a calculated signal are caught by this try/
            // catch.
            const result = flattennedChildrenSignal.value;
            return result;
        } catch (ex) {
            return $val(renderError)(ex);
        }
    };

    return $derived(errorBoundaryCalculation);
};
