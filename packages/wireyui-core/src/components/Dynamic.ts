import { calc } from '../signals/CalculatedSignal.js';
import { valueOf } from '../signals/valueOf.js';
import type { Props } from '../types.js';

export interface DynamicProps<T> {
    value: T;
    children: (value: T) => JSX.Element;
}

/**
 * Dynamic component, component replaces children with new result whenever the value signal updates.
 * @param props
 * @returns
 */
export function Dynamic<T>(props: Props<DynamicProps<T>>): JSX.Element {
    const showCalculation = (): JSX.Element => {
        const value = valueOf(props.value);
        return valueOf(props.children)(value);
    };

    return calc(showCalculation);
}
