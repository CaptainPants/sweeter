import { $calc } from '../signals/$calc.js';
import { $val } from '../signals/$val.js';
import { type PropertiesMightBeSignals } from '../types.js';

export type DynamicProps<T> = PropertiesMightBeSignals<{
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
        const actualValue = $val(value);
        return $val(children)(actualValue);
    };

    return $calc(showCalculation);
}

// No shortcut here as you can just use $calc directly
