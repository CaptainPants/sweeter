import { Union } from "@ark/schema";
import { type, Type } from "arktype";

import { throwError } from "@captainpants/sweeter-utilities";

import { AnyTypeConstraint } from "../AnyTypeConstraint";

export function tryGetArrayInfo(schema: AnyTypeConstraint): { elementType: Type<unknown> } {
    throw new Error('Not implemented');
}
type.Array
/**
 * 
 * @param schema 
 * @throws if they schema is not an array.
 * @returns 
 */
export function getArrayInfo(schema: AnyTypeConstraint) {
    return tryGetArrayInfo(schema) ?? throwError(new TypeError('Schema was not a union'));
}