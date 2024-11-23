import { type, Type } from 'arktype';
import { throwError } from '@captainpants/sweeter-utilities';
import { AnyTypeConstraint } from '../AnyTypeConstraint';
import { ObjectType } from 'arktype/internal/methods/object.ts';
import { BaseRoot } from '@ark/schema';

export interface ObjectTypeInfo {
    fixedProps: Map<string, Type<unknown>>;

    stringMappingType?: Type<unknown>;
    symbolMappingType?: Type<unknown>;
}

export function tryGetObjectTypeInfo(
    schema: AnyTypeConstraint,
): ObjectTypeInfo | undefined {
    const keys = (schema as never as BaseRoot).keyof();
    
    // Search keys for a string and/or a symbol. Split off the other ones.

    throw new Error('Not implemented');
}

export function getObjectTypeInfo(schema: AnyTypeConstraint): ObjectTypeInfo {
    return (
        tryGetObjectTypeInfo(schema) ??
        throwError(new TypeError('Schema was not a union'))
    );
}
