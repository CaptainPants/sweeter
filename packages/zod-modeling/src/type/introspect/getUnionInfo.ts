import { Union } from "@ark/schema";
import { AnyTypeConstraint } from "../AnyTypeConstraint";
import { tryCast } from "../internal/tools";
import { throwError } from "@captainpants/sweeter-utilities";
import { Type } from "arktype";

export function tryGetUnionInfo(schema: AnyTypeConstraint) {
    const typed = tryCast(schema, Union.Node);
    if (!typed) {
        return undefined;
    }
    return {
        branches: typed.branchGroups as unknown as readonly Type<unknown>[]
    };
}

/**
 * 
 * @param schema 
 * @throws if they schema is not a union.
 * @returns 
 */
export function getUnionInfo(schema: AnyTypeConstraint) {
    return tryGetUnionInfo(schema) ?? throwError(new TypeError('Schema was not a union'));
}