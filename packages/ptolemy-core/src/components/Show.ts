import { getRuntime } from '../runtime/Runtime.js';
import { $derived } from '../signals/$derived.js';
import { $val } from '../signals/$val.js';
import {
    type Component,
    type MightBeSignal,
    type PropertiesMightBeSignals,
} from '../types.js';

export type ShowProps = PropertiesMightBeSignals<{
    /**
     * Condition, used to decide whether or not to render 'children'.
     */
    if: boolean;

    /**
     * Content to render if condition is met.
     *
     * This is invoked inside a $derived.
     * @returns
     */
    children: () => JSX.Element;

    /**
     * Content to render if condition is not met.
     *
     * This is invoked inside a $derived.
     */
    otherwise?: (() => JSX.Element) | undefined;
}>;

/**
 * Dynamic component - display children when condition is true.
 * @param props
 * @returns
 */
export const Show: Component<ShowProps> = ({
    if: condition,
    children,
    otherwise,
}: ShowProps) => {
    const showCalculation = (): JSX.Element => {
        if ($val(condition)) {
            return $val(children)();
        } else {
            return $val(otherwise)?.();
        }
    };

    return $derived(showCalculation);
};

/**
 * Conditionally render some content.
 * @param condition Condition, used to decide whether or not to render 'children'.
 * @param ifTrue Content to render if condition is met. This is invoked inside a $derived.
 * @param otherwise Content to render if condition is not met. This is invoked inside a $derived.
 * @returns
 */
export function $if(
    condition: MightBeSignal<boolean>,
    ifTrue: MightBeSignal<() => JSX.Element>,
    otherwise?: MightBeSignal<(() => JSX.Element) | undefined>,
): JSX.Element {
    return getRuntime().jsx(Show, {
        if: condition,
        children: ifTrue,
        otherwise,
    });
}
