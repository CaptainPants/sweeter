import { $wrap } from '../signals/$wrap.js';
import { Signal } from '../signals/types.js';
import {
    PropertiesAreSignals,
    PropertiesMightBeSignals,
} from '../types/index.js';

// TODO: does this duplicate mapProps without the propMappings parameter - and therefore it should be the same..
export function wrapPropertiesAreSignals<T>(
    propertiesMightBeSignals: PropertiesMightBeSignals<T>,
): PropertiesAreSignals<T> {
    const result = {} as Record<keyof T, Signal<unknown>>;

    for (const key of Object.keys(propertiesMightBeSignals) as (keyof T)[]) {
        const wrapped = $wrap(propertiesMightBeSignals[key]);
        result[key] = wrapped;
    }

    return result as PropertiesAreSignals<T>;
}
