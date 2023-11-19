import { getRuntime } from '../index.js';
import { $calc } from '../signals/CalculatedSignal.js';
import { valueOf } from '../signals/valueOf.js';
import type { Component, MightBeSignal, SignalifyProps } from '../types.js';

export type ShowProps = SignalifyProps<{
    if: boolean;
    children: () => JSX.Element;
    otherwise?: () => JSX.Element;
}>;

/**
 * Dynamic component - display children when condition is true.
 * @param props
 * @returns
 */
export const Show: Component<ShowProps> = ({
    if: if_,
    children,
    otherwise,
}: ShowProps) => {
    const showCalculation = (): JSX.Element => {
        if (valueOf(if_)) {
            return valueOf(children)();
        } else {
            return valueOf(otherwise)?.();
        }
    };

    return $calc(showCalculation);
};

export function $if(
    condition: MightBeSignal<boolean>,
    ifTrue: MightBeSignal<() => JSX.Element>,
    otherwise: MightBeSignal<() => JSX.Element>,
): JSX.Element {
    return getRuntime().jsx(Show, {
        if: condition,
        children: ifTrue,
        otherwise,
    });
}
