import { Signal } from '../index.js';
import { $derived } from '../signals/$derived.js';
import { $val } from '../signals/$val.js';
import { PropsDef } from '../types.js';

export interface DynamicProps<T extends number> {
    value: T;
    /**
     * This is called inside a $derived, so 1) you cannot directly mutate signals in the children callback unless you use untrack, and 2) any signals used will be subscribed to.
     * @param value
     * @returns
     */
    children: (value: T) => JSX.Element;
}

/**
 * Dynamic component, component replaces children with new result whenever the value signal updates.
 * @param props
 * @returns
 */
export function Dynamic<T extends number>(
    props: PropsDef<DynamicProps<T>>,
): JSX.Element;
export function Dynamic<T extends number>({
    children,
    value: valueSignal,
}: PropsDef<DynamicProps<T>> & { value: Signal<T> }): JSX.Element {
    const showCalculation = (): JSX.Element => {
        const value = valueSignal.value;
        return $val(children)(value);
    };

    return $derived(showCalculation);
}

// No shortcut here as you can just use $derived directly
