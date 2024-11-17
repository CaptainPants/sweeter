
import { type } from 'arktype';

import { descend } from '@captainpants/sweeter-utilities';

import { serializeSchemaForDisplay } from './serializeSchemaForDisplay.js';
import { arkTypeUtilityTypes } from './arkTypeUtilityTypes.js';

import { introspect } from '../type/introspect/index.js';

export function createDefault<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
    schema: TArkType,
): type.infer<TArkType> {
    return createDefaultImplementation(schema, descend.defaultDepth);
}

function createDefaultImplementation<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
    schema: TArkType,
    depth: number,
): type.infer<TArkType> {
    if (schema.meta.default) {
        return schema.meta.default as never;
    }

    const objectTypeInfo = introspect.tryGetObjectTypeInfo(schema);
    const unionTypeInfo = introspect.tryGetUnionTypeInfo(schema);
    
    if (objectTypeInfo) {
        const instance: Record<string | symbol, unknown> = {};

        for (const [key, propType] of objectTypeInfo.fixedProps) {
            instance[key] = createDefaultImplementation(propType, descend(depth));
        }

        return instance as never;

    } else if (unionTypeInfo) {
        const branches = unionTypeInfo.branches;

        if (branches.length === 0)
        {
            throw new TypeError('Unexpected union of length zero.');
        }

        return createDefaultImplementation(
            branches[0]!,
            descend(depth),
        ) as never;
    } else if (introspect.isArrayType(schema)) {
        return [] as type.infer<TArkType>;
    } else if (introspect.isStringType(schema)) {
        return '' as type.infer<TArkType>;
    } else if (introspect.isNumberType(schema)) {
        return 0 as type.infer<TArkType>;
    } else if (introspect.isBooleanType(schema)) {
        return false as type.infer<TArkType>;
    } else if (
        introspect.isUndefinedConstant(schema)
    ) {
        return undefined as type.infer<TArkType>;
    } else if (introspect.isNullConstant(schema)) {
        return null as type.infer<TArkType>;
    } else {
        throw new TypeError(
            `Could not create default value for schema ${serializeSchemaForDisplay(
                schema,
            )}`,
        );
    }
}
