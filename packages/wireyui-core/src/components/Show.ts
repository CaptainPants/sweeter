import { calc } from '../signals/CalculatedSignal.js';
import { valueOf } from '../signals/valueOf.js';
import type { Component, Props } from '../types.js';

export interface ShowProps {
    if: boolean;
    children: () => JSX.Element;
}

/**
 * Dynamic component - display children when condition is true.
 * @param props
 * @returns
 */
export const Show: Component<ShowProps> = (props: Props<ShowProps>) => {
    const showCalculation = (): JSX.Element => {
        if (valueOf(props.if)) {
            return valueOf(props.children)();
        }
        return undefined;
    };

    return calc(showCalculation);
};
