import { type AttributeValue } from './_types.js';
import { type Type } from './Type.js';

export interface KnownAttribute<TName extends string, T> {
    (value: T): AttributeValue<T>;

    readonly attributeName: TName;

    get: (from: Type<unknown>) => T;
    getOrFallback: (from: Type<unknown>, fallback: T) => T;
    getOrUndefined: (from: Type<unknown>) => T | undefined;
}

export function createKnownAttribute<TName extends string, T>(
    name: TName,
    type: Type<T>,
): KnownAttribute<TName, T> {
    function result(value: T): { name: string; value: T } {
        return { name, value };
    }
    result.get = function (from: Type<unknown>): T {
        const value = from.getAttribute(name);
        if (!type.matches(value)) {
            throw new TypeError(`Expected ${type.toTypeString()}.`);
        }
        return value;
    };
    result.getOrFallback = function (from: Type<unknown>, fallback: T): T {
        const value = from.getAttribute(name);
        if (!type.matches(value)) {
            return fallback;
        }
        return value;
    };
    result.getOrUndefined = function (from: Type<unknown>): T | undefined {
        const value = from.getAttribute(name);
        if (!type.matches(value)) {
            return undefined;
        }
        return value;
    };
    result.attributeName = name;
    return result;
}
