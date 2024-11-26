import { Type } from 'arktype';

import { throwError } from '@captainpants/sweeter-utilities';

import { UnknownType } from '../types';
import { asIntersectionNode } from './internal/arktypeInternals';

export interface ArrayTypeInfo {
    readonly elementType: UnknownType;
}

export function tryGetArrayTypeInfo(schema: UnknownType): ArrayTypeInfo | undefined {
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
export function getArrayTypeInfo(schema: UnknownType) {
    return (
        tryGetArrayTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
