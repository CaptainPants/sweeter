import { $calc } from '../signals/CalculatedSignal.js';
import { valueOf } from '../signals/valueOf.js';
import type { Component, SignalifyProps } from '../types.js';

export type ShowProps = SignalifyProps<{
    if: boolean;
    children: () => JSX.Element;
}>;

/**
 * Dynamic component - display children when condition is true.
 * @param props
 * @returns
 */
export const Show: Component<ShowProps> = (props: ShowProps) => {
    const showCalculation = (): JSX.Element => {
        if (valueOf(props.if)) {
            return valueOf(props.children)();
        }
        return undefined;
    };

    return $calc(showCalculation);
};
