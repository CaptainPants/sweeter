import { type Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import { type UnknownType } from '../types.js';

import { asUnionNode } from './internal/arktypeInternals.js';

export function tryGetUnionTypeInfo(schema: UnknownType) {
    const typed = asUnionNode(schema as never);
    if (!typed?.branches) {
        return undefined;
    }
    return {
        branches: typed.branches as unknown as readonly Type<unknown>[],
    };
}

/**
 *
 * @param schema
 * @throws if they schema is not a union.
 * @returns
 */
export function getUnionTypeInfo(schema: UnknownType) {
    return (
        tryGetUnionTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
