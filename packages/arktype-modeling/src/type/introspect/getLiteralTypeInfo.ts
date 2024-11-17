import { Unit } from "@ark/schema";
import { AnyTypeConstraint } from "../AnyTypeConstraint";
import { tryCast } from "../internal/tools";
import { throwError } from "@captainpants/sweeter-utilities";

export function tryGetLiteralTypeInfo(schema: AnyTypeConstraint) {
    const typed = tryCast(schema, Unit.Node);
    if (!typed) {
        return undefined;
    }
    return {
        value: typed.compiledValue as unknown
    };
}

export function getLiteralTypeInfo(schema: AnyTypeConstraint) {
    return tryGetLiteralTypeInfo(schema) ?? throwError(new TypeError('Schema was not a literal'));
}