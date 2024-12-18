import { type type } from 'arktype';

import { descend } from '@captainpants/sweeter-utilities';

import { serializeSchemaForDisplay } from './serializeSchemaForDisplay.js';

import { introspect } from '../type/introspect/index.js';
import { type AnyTypeConstraint } from '../type/types.js';
import { getUnitTypeInfo } from '../type/introspect/getUnitTypeInfo.js';

export function createDefault<TSchema extends AnyTypeConstraint>(
    schema: TSchema,
): type.infer<TSchema> {
    return createDefaultImplementation(schema, descend.defaultDepth);
}

function createDefaultImplementation<TSchema extends AnyTypeConstraint>(
    schema: TSchema,
    depth: number,
): type.infer<TSchema> {
    if (schema.meta.default) {
        return schema.meta.default as never;
    }

    const objectTypeInfo = introspect.tryGetObjectTypeInfo(schema);
    const unionTypeInfo = introspect.tryGetUnionTypeInfo(schema);

    if (objectTypeInfo) {
        const instance: Record<string | symbol, unknown> = {};

        for (const [key, propType] of objectTypeInfo.getProperties()) {
            instance[key] = createDefaultImplementation(
                propType,
                descend(depth),
            );
        }

        return instance as never;
    } else if (unionTypeInfo) {
        const branches = unionTypeInfo.branches;

        if (branches.length === 0) {
            throw new TypeError('Unexpected union of length zero.');
        }

        return createDefaultImplementation(
            branches[0]!,
            descend(depth),
        ) as never;
    } else if (introspect.isArrayType(schema)) {
        return [] as type.infer<TSchema>;
    } else if (introspect.isStringType(schema)) {
        return '' as type.infer<TSchema>;
    } else if (introspect.isNumberType(schema)) {
        return 0 as type.infer<TSchema>;
    } else if (introspect.isBooleanType(schema)) {
        return false as type.infer<TSchema>;
    } else if (introspect.isLiteralType(schema)) {
        const info = getUnitTypeInfo(schema);
        if (info) return info.value as type.infer<TSchema>;
        throw new TypeError('Unexpected');
    } else {
        throw new TypeError(
            `Could not create default value for schema ${serializeSchemaForDisplay(
                schema,
            )}`,
        );
    }
}