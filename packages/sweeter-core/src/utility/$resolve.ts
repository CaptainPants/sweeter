import { type Signal } from '../signals/types.js';
import { $val } from '../signals/$val.js';

/**
 * If the value is a signal, call .value (therefore subscribing). If the value is now a function, call it with zero arguments.
 *
 * Convenience function mostly for use with children props and similar.
 *
 * @param children
 * @returns
 */
export function $resolve<T>(
    children: T | (() => T) | Signal<T | (() => T)>,
): T {
    const resolved = $val(children);

    if (typeof resolved === 'function') {
        // T could be a function type, so we need to cheat the type-system here
        return (resolved as () => T)();
    }

    return resolved;
}
