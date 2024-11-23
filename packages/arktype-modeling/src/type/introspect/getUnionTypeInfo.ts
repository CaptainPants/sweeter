import { AnyTypeConstraint } from '../AnyTypeConstraint';
import { throwError } from '@captainpants/sweeter-utilities';
import { Type } from 'arktype';
import { InterrogableNode } from './types';

export function tryGetUnionTypeInfo(schema: AnyTypeConstraint) {
    const typed = schema as never as InterrogableNode;
    if (!typed.inner.union) {
        return undefined;
    }
    return {
        branches: typed.inner.union.branchGroups as unknown as readonly Type<unknown>[],
    };
}

/**
 *
 * @param schema
 * @throws if they schema is not a union.
 * @returns
 */
export function getUnionTypeInfo(schema: AnyTypeConstraint) {
    return (
        tryGetUnionTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
