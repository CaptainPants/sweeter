import { throwError } from '@captainpants/sweeter-utilities';
import { BaseRoot } from '@ark/schema';

import { UnknownType, AnyTypeConstraint } from '../types';
import { asIntersectionNode } from './internal/arktypeInternals';

export interface ObjectTypeInfo {
    /**
     * Map of properties by name (excludes indexers).
     */
    getProperties(): ReadonlyMap<string | symbol, UnknownType>;
    getMappedKeys(): ReadonlyMap<UnknownType, UnknownType>;
}

export function tryGetObjectTypeInfo(
    schema: UnknownType,
): ObjectTypeInfo | undefined {
    const node = schema as never as BaseRoot;

    const asObject = asIntersectionNode(node);
    if (!asObject) {
        return undefined;
    }

    return {
        getProperties() {
            const result: Map<string | symbol, UnknownType> = new Map();

            for (const prop of asObject.props) {
                result.set(prop.key, prop.value as never);
            }

            return result;
        },
        getMappedKeys() {
            const result = new Map<UnknownType, UnknownType>();
            const keys = node.keyof().branches;
            for (const key of keys) {
                result.set(key as never, node.get(key) as never);
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
