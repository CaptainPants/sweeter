import { UnknownType } from '../types';
import { throwError } from '@captainpants/sweeter-utilities';
import { Type } from 'arktype';
import { asUnionNode } from './internal/arktypeInternals';

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
