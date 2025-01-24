import { type BaseRoot } from '@ark/schema';

import { throwError } from '@serpentis/ptolemy-utilities';

import { type PropertyInfo, type UnknownType } from '../types.js';

import { asIntersectionNode } from './internal/arktypeInternals.js';

export interface ObjectTypeInfo {
    /**
     * Map of properties by name (excludes indexers).
     */
    getFixedProperties(): ReadonlyMap<string | symbol, PropertyInfo>;
    getMappedKeys(): ReadonlyMap<UnknownType, UnknownType>;
}

export function tryGetObjectTypeInfo(
    schema: UnknownType,
): ObjectTypeInfo | undefined {
    const node = schema as never as BaseRoot;

    const asObject = asIntersectionNode(node);
    if (!asObject || asObject.structure?.sequence?.element) {
        return undefined;
    }

    return {
        getFixedProperties() {
            const result: Map<string | symbol, PropertyInfo> = new Map();

            for (const prop of asObject.props) {
                result.set(prop.key, {
                    type: prop.value as unknown as UnknownType,
                    optional: prop.optional ?? false,
                });
            }

            return result;
        },
        getMappedKeys() {
            const result = new Map<UnknownType, UnknownType>();
            const keys = node.keyof().branches;
            for (const key of keys) {
                const current = node.get(key);

                result.set(key as never, current as unknown as UnknownType);
            }
            return result;
        },
    };
}

export function getObjectTypeInfo(schema: UnknownType): ObjectTypeInfo {
    return (
        tryGetObjectTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
