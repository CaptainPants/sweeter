import { $derived } from '../signals/$derived.js';
import { $val } from '../signals/$val.js';
import { type Component } from '../types/index.js';
import { $insertLocation } from '../utility/$insertLocation.js';
import { flattenElements } from '../utility/flattenElements.js';

export interface ErrorBoundaryProps {
    renderError: (error: unknown) => JSX.Element;

    /**
     * Not that passing in a JSX.Element is probably a mistake as it won't act as if its in the ErrorBoundary. In these cases you probable want a $derived.
     *
     * Note that a function here will be wrapped in a $derived.
     */
    children: JSX.Element | (() => JSX.Element);
}

export const ErrorBoundary: Component<ErrorBoundaryProps> = ({
    renderError,
    children,
}) => {
    // Calls .value on any signals, which should cause the catch to trigger
    const flattennedChildrenSignal = $derived(() => {
        const value = children.value;
        const resolved = typeof value === 'function' ? $derived(value) : value;

        const flattened = flattenElements(resolved).identify('flattened', ...$insertLocation());
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
