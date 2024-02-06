import { type Unsignal } from '../signals/types.js';
import { $val } from '../signals/$val.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallParameters<T> = T extends (...args: infer S) => any ? S : [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallResult<T> = T extends (...args: any[]) => infer S ? S : T;

/**
 * If the parameter is a signal get its .value and use that as the value.
 *
 * If the value is a function, call it with parameters provided. Otherwise return the value unchanged.
 *
 * Convenience function mostly for use with children props.
 *
 * Expects as a parameter types like MightBeSignals<JSX.Element | () => JSX.Element>.
 *
 * @param children
 * @returns
 */
export function $children<T>(
    children: T,
    ...params: CallParameters<Unsignal<T>>
): CallResult<Unsignal<T>> {
    const resolved = $val(children);

    if (typeof resolved === 'function') {
        // T could be a function type, so we need to cheat the type-system here
        return (
            resolved as (
                ...args: CallParameters<Unsignal<T>>
            ) => CallResult<Unsignal<T>>
        )(...params);
    }

    return resolved as CallResult<Unsignal<T>>;
}
