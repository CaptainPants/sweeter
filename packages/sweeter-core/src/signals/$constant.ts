import { $calc } from './$calc.js';

export function $constant<T>(value: T) {
    return $calc(() => value);
}