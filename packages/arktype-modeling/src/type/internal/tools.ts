import { Constructor } from '../../types';

export function tryCast<TType>(
    instance: unknown,
    Constructor: Constructor<TType>,
): TType | undefined {
    if (instance instanceof Constructor) {
        return instance;
    }
    return undefined;
}
