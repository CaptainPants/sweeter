import { type type } from 'arktype';

import { notFound } from '../notFound.js';
import { is } from '../type/introspect/is.js';
import { AnyTypeConstraint } from '../type/types.js';
import { serializeSchemaForDisplay } from '../utility/serializeSchemaForDisplay.js';

export interface KnownAttribute<
    TName extends string,
    TSchema extends AnyTypeConstraint,
> {
    // TODO: reconsider if this call signature makes sense/is required. Seems to do very little.
    (from: TSchema): type.infer<TSchema> | undefined;

    readonly attributeName: TName;

    get: (from: TSchema) => type.infer<TSchema>;
    getOrFallback: (
        from: TSchema,
        fallback: type.infer<TSchema>,
    ) => type.infer<TSchema>;
    getOrUndefined: (from: TSchema) => type.infer<TSchema> | undefined;
}

export function createKnownAttribute<
    TName extends string,
    TSchema extends AnyTypeConstraint,
>(name: TName, schema: TSchema): KnownAttribute<TName, TSchema> {
    function result(from: TSchema): type.infer<TSchema> | undefined {
        if (!from.hasAnnotations()) return undefined;
        const value = from.annotations()?.attr(name, undefined);
        if (value === undefined || !is(value, schema)) {
            return undefined;
        }
        return value;
    }

    // Alias for consistency
    result.get = (from: TSchema): type.infer<TSchema> => {
        if (!from.hasAnnotations()) throw new TypeError(`MetaData not found`);
        const value = from.annotations()?.attr(name, notFound);
        if (value === notFound || !is(value, schema)) {
            throw new TypeError(
                `Expected ${serializeSchemaForDisplay(schema)}.`,
            );
        }
        return value;
    };

    result.getOrFallback = function (
        from: TSchema,
        fallback: type.infer<TSchema>,
    ): type.infer<TSchema> {
        if (!from.hasAnnotations()) return fallback;
        const value = from.annotations()?.attr(name, notFound);
        if (value === notFound || !is(value, schema)) {
            return fallback;
        }
        return value;
    };
    result.getOrUndefined = result;
    result.attributeName = name;
    return result;
}
