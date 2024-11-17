import { type } from 'arktype';

import { arkTypeUtilityTypes, notFound } from '../index.js';
import { serializeSchemaForDisplay } from '../utility/serializeSchemaForDisplay.js';
import { is } from '../type/introspect/is.js';

export interface KnownAttribute<
    TName extends string,
    TArkType extends arkTypeUtilityTypes.AnyTypeConstraint,
> {
    // TODO: reconsider if this call signature makes sense/is required. Seems to do very little.
    (from: TArkType): type.infer<TArkType> | undefined;

    readonly attributeName: TName;

    get: (from: TArkType) => type.infer<TArkType>;
    getOrFallback: (
        from: TArkType,
        fallback: type.infer<TArkType>,
    ) => type.infer<TArkType>;
    getOrUndefined: (from: TArkType) => type.infer<TArkType> | undefined;
}

export function createKnownAttribute<
    TName extends string,
    TArkType extends arkTypeUtilityTypes.AnyTypeConstraint,
>(name: TName, schema: TArkType): KnownAttribute<TName, TArkType> {
    function result(from: TArkType): type.infer<TArkType> | undefined {
        if (!from.hasAnnotations()) return undefined;
        const value = from.annotations().getAttr(name, undefined);
        if (value === undefined || !is(value, schema)) {
            return undefined;
        }
        return value;
    }

    // Alias for consistency
    result.get = (from: TArkType): type.infer<TArkType> => {
        if (!from.hasAnnotations()) throw new TypeError(`MetaData not found`);
        const value = from.annotations().getAttr(name, notFound);
        if (value === notFound || !is(value, schema)) {
            throw new TypeError(
                `Expected ${serializeSchemaForDisplay(schema)}.`,
            );
        }
        return value;
    };

    result.getOrFallback = function (
        from: TArkType,
        fallback: type.infer<TArkType>,
    ): type.infer<TArkType> {
        if (!from.hasAnnotations()) return fallback;
        const value = from.annotations().getAttr(name, notFound);
        if (value === notFound || !is(value, schema)) {
            return fallback;
        }
        return value;
    };
    result.getOrUndefined = result;
    result.attributeName = name;
    return result;
}
