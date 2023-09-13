import { MutableSignal, Signal } from "./types"

export function isSignal(value: unknown): value is Signal<unknown> {
    return typeof value === 'object' && value !== null && 'value' in value;
}

export function isMutableSignal(value: unknown): value is MutableSignal<unknown> {
    if (!isSignal(value)) {
        return false;
    }

    const prop = getProperty(value);
    return prop?.writable || prop?.set !== undefined;
}

function getProperty(obj: object): PropertyDescriptor | undefined {
    for (let cur = obj; cur; cur = Object.getPrototypeOf(cur)) {
        const property = Object.getOwnPropertyDescriptor(cur, 'value');
        if (property) {
            return property;
        }
    }
    return undefined;
}