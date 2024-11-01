import { type z } from 'zod';
import { type AttributeValue } from './_types.js';
import { notFound } from '../index.js';
import { serializeSchemaForDisplay } from '../utility/serializeSchemaForDisplay.js';
import { is } from '../type/is/is.js';

export interface KnownAttribute<TName extends string, T> {
    (value: T): AttributeValue<T>;

    readonly attributeName: TName;

    get: (from: z.ZodType<T>) => T;
    getOrFallback: (from: z.ZodType<T>, fallback: T) => T;
    getOrUndefined: (from: z.ZodType<T>) => T | undefined;
}

export function createKnownAttribute<TName extends string, T>(
    name: TName,
    schema: z.ZodType<T>,
): KnownAttribute<TName, T> {
    function result(value: T): { name: string; value: T } {
        return { name, value };
    }
    result.get = function (from: z.ZodType<T>): T {
        if (!from.hasMetaData()) throw new TypeError(`MetaData not found`);
        const value = from.meta().getAttr(name, notFound);
        if (value === notFound || !is(value, schema)) {
            throw new TypeError(
                `Expected ${serializeSchemaForDisplay(schema)}.`,
            );
        }
        return value;
    };
    result.getOrFallback = function (from: z.ZodType<T>, fallback: T): T {
        if (!from.hasMetaData()) return fallback;
        const value = from.meta().getAttr(name, notFound);
        if (value === notFound || !is(value, schema)) {
            return fallback;
        }
        return value;
    };
    result.getOrUndefined = function (from: z.ZodType<T>): T | undefined {
        if (!from.hasMetaData()) return undefined;
        const value = from.meta().getAttr(name, undefined);
        if (value === undefined || !is(value, schema)) {
            return undefined;
        }
        return value;
    };
    result.attributeName = name;
    return result;
}
