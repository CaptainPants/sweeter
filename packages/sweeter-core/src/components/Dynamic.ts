import { $calc } from '../signals/CalculatedSignal.js';
import { valueOf } from '../signals/valueOf.js';
import type { SignalifyProps } from '../types.js';

export type DynamicProps<T> = SignalifyProps<{
    value: T;
    children: (value: T) => JSX.Element;
}>;

/**
 * Dynamic component, component replaces children with new result whenever the value signal updates.
 * @param props
 * @returns
 */
export function Dynamic<T>(props: DynamicProps<T>): JSX.Element;
export function Dynamic<T>({ children, value }: DynamicProps<T>): JSX.Element {
    const showCalculation = (): JSX.Element => {
        const actualValue = valueOf(value);
        return valueOf(children)(actualValue);
    };

    return $calc(showCalculation);
}

// No shortcut here as you can just use $calc directly
