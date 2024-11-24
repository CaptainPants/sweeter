import { Union } from '@ark/schema';
import { type, Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import { AnyTypeConstraint } from '../AnyTypeConstraint';
import { asIntersectionNode } from './internal/arktypeInternals';

export interface ArrayTypeInfo {
    elementType: Type<unknown>;
}

export function tryGetArrayTypeInfo(schema: AnyTypeConstraint): ArrayTypeInfo | undefined {
    const elementType = asIntersectionNode(schema as never)?.structure?.sequence?.element;
    if (!elementType) { return undefined; }
    return {
        elementType: elementType as never
    };
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
