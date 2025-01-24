export function deepFreeze<T>(value: T): T {
    if (Object.isFrozen(value)) {
        return value;
    }

    if (value === null || value === undefined) {
        return value;
    }

    Object.freeze(value);

    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            value.forEach((item: unknown) => deepFreeze(item));
        } else {
            Object.getOwnPropertyNames(value).forEach((key) => {
                deepFreeze((value as Record<string, unknown>)[key]);
            });
            if (typeof Object.getOwnPropertySymbols !== 'undefined') {
                Object.getOwnPropertySymbols(value).forEach((key) => {
                    deepFreeze((value as Record<symbol, unknown>)[key]);
                });
            }
        }
    }

    return value;
}
