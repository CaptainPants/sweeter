import { $derive } from './$derive.js';

export function $constant<T>(value: T) {
    return $derive(() => value);
}
