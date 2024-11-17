import { Type } from "arktype";
import { AnyObjectTypeConstraint } from "../AnyObjectTypeConstraint";
import { throwError } from "@captainpants/sweeter-utilities";
import { AnyTypeConstraint } from "../AnyTypeConstraint";

export interface ObjectTypeInfo {
    fixedProps: Map<string, Type<unknown>>;
    
    stringMappingType?: Type<unknown>;
    symbolMappingType?: Type<unknown>;
}

export function tryGetObjectTypeInfo(schema: AnyTypeConstraint): ObjectTypeInfo | undefined {
    throw new Error('Not implemented');
}

export function getObjectTypeInfo(schema: AnyTypeConstraint): ObjectTypeInfo {
    return tryGetObjectTypeInfo(schema) ?? throwError(new TypeError('Schema was not a union'));
}