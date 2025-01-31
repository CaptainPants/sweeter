import { $derived } from '../signals/$derived.js';
import { $val } from '../signals/$val.js';
import { PropsDef, PropTreatment } from '../types.js';

export interface DynamicProps<T> {
    value: PropTreatment<T, true>;
    /**
     * This is called inside a $derived, so 1) you cannot directly mutate signals in the children callback unless you use untrack, and 2) any signals used will be subscribed to.
     * @param value
     * @returns
     */
    children: (value: T) => JSX.Element;
};


/**
 * Dynamic component, component replaces children with new result whenever the value signal updates.
 * @param props
 * @returns
 */
export function Dynamic<T>(props: PropsDef<DynamicProps<T>>): JSX.Element;
export function Dynamic<T>({ children, value: valueSignal }: PropsDef<DynamicProps<T>>): JSX.Element {
    const showCalculation = (): JSX.Element => {
        const value = valueSignal.value;
        return $val(children)(value);
    };

    return $derived(showCalculation);
}

// No shortcut here as you can just use $derived directly
