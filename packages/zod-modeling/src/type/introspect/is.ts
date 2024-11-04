import { type, Type } from 'arktype';
import { BaseNode, Domain, Union, Unit } from '@ark/schema';

import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { safeParse } from '../../utility/parse.js';
import { tryCast } from '../internal/tools.js';

export function is<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(val: unknown, type: TArkType): val is type.infer<TArkType> {
    const res = safeParse(val, type);
    return res.success;
}

export function isObjectType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<{ readonly [key: string]: unknown }> {
    return tryCast(schema, Domain.Node)?.domain === 'object';
}
export function isArrayType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is Type<unknown[]> & { readonly element: Type<unknown> } {
    throw new TypeError('TODO: not implemented');
    // Seems to come through as a weird looking intersection (Intersection.Node), 
    // not sure why its not Sequence.Node
}

export function isUnionType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return tryCast(schema, Union.Node) !== undefined;
}

export function isNumberType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<number> {
    return tryCast(schema, Domain.Node)?.domain === 'number';
}

export function isStringType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<string> {
    return tryCast(schema, Domain.Node)?.domain === 'string';
}

export function isBooleanType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<boolean> {
    return tryCast(schema, Union.Node)?.isBoolean ?? false;
}

export function isNumberLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return typeof tryCast(schema, Unit.Node)?.compiledValue === 'number';
}

export function isStringLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return typeof tryCast(schema, Unit.Node)?.compiledValue === 'string';
}

export function isBooleanLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return typeof tryCast(schema, Unit.Node)?.compiledValue === 'boolean';
}

export function isBooleanTrueLiteral(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === true;
}

export function isBooleanFalseLiteral(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === true;
}

export function isNullConstant(
    schema: arkTypeUtilityTypes.AnyTypeConstraint
): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === null;
}

export function isUndefinedConstant(
    schema: arkTypeUtilityTypes.AnyTypeConstraint
): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === undefined;
}

export function isLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): boolean {
    return (
        isStringLiteralType(schema) ||
        isNumberLiteralType(schema) ||
        isBooleanLiteralType(schema) ||
        isNullConstant(schema) || 
        isUndefinedConstant(schema)
    );
}

export function isStringOrStringLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is Type<string> {
    return isStringType(schema) || isStringLiteralType(schema);
}

export function isNumberOrNumberLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is Type<number> {
    return isNumberType(schema) || isNumberLiteralType(schema);
}

export function isBooleanOrBooleanLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is Type<boolean> {
    return isBooleanType(schema) || isBooleanLiteralType(schema);
}

export function isUnknownType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<unknown> {
    throw new TypeError('TODO: not implemented');
    // Seems to come through as a weird looking intersection (Intersection.Node)
}