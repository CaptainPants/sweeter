import { $derived } from '../signals/$derived.js';
import { $val } from '../signals/$val.js';
import { type PropertiesMightBeSignals } from '../types.js';

export type DynamicProps<T> = PropertiesMightBeSignals<{
    value: T;
    /**
     * This is called inside a $derived, so 1) you cannot directly mutate signals in the children callback unless you use untrack, and 2) any signals used will be subscribed to.
     * @param value
     * @returns
     */
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
        const actualValue = $val(value);
        return $val(children)(actualValue);
    };

    return $derived(showCalculation);
}

// No shortcut here as you can just use $derived directly
