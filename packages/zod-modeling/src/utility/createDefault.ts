import { descend } from '@captainpants/sweeter-utilities';
import { serializeSchemaForDisplay } from './serializeSchemaForDisplay.js';
import { arkTypeUtilityTypes } from './arkTypeUtilityTypes.js';
import { type } from 'arktype';
import { isArrayType, isBooleanType, isNullConstant, isNumberType, isObjectType, isStringType, isUndefinedConstant, isUnionType } from '../type/index.js';

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

    if (isObjectType(schema)) {
        const instance: Record<string | symbol, unknown> = {};

        for (const { key, value: propType } of schema.props) {
            instance[key] = createDefaultImplementation(propType, descend(depth));
        }

        return instance as never;

    } else if (isUnionType(schema)) {
        if (schema.branchGroups.length === 0)
        {
            throw new TypeError('Unexpected union of length zero.');
        }

        return createDefaultImplementation(
            schema.branchGroups[0]!,
            descend(depth),
        );
    } else if (isArrayType(schema)) {
        return [] as type.infer<TArkType>;
    } else if (isStringType(schema)) {
        return '' as type.infer<TArkType>;
    } else if (isNumberType(schema)) {
        return 0 as type.infer<TArkType>;
    } else if (isBooleanType(schema)) {
        return false as type.infer<TArkType>;
    } else if (
        isUndefinedConstant(schema)
    ) {
        return undefined as type.infer<TArkType>;
    } else if (isNullConstant(schema)) {
        return null as type.infer<TArkType>;
    } else {
        throw new TypeError(
            `Could not create default value for schema ${serializeSchemaForDisplay(
                schema,
            )}`,
        );
    }
}
