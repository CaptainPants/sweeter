import { type Constructor } from '../../types.js';

export function tryCast<TType>(
    instance: unknown,
    Constructor: Constructor<TType>,
): TType | undefined {
    if (instance instanceof Constructor) {
        return instance;
    }
    return undefined;
}
