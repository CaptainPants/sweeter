import { Union } from '@ark/schema';
import { type, Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import { AnyTypeConstraint } from '../AnyTypeConstraint';

export interface ArrayTypeInfo {
    elementType: Type<unknown>;
}

export function tryGetArrayTypeInfo(schema: AnyTypeConstraint): ArrayTypeInfo {
    throw new Error('Not implemented');
}

/**
 *
 * @param schema
 * @throws if they schema is not an array.
 * @returns
 */
export function getArrayTypeInfo(schema: AnyTypeConstraint) {
    return (
        tryGetArrayTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
