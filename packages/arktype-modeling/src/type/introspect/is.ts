import { type, Type } from 'arktype';
import { Domain, Union, Unit } from '@ark/schema';

import { safeParse } from '../../utility/parse.js';
import { tryCast } from '../internal/tools.js';
import { AnyTypeConstraint } from '../AnyTypeConstraint.js';

export function is<TArkType extends AnyTypeConstraint>(
    val: unknown,
    type: TArkType,
): val is type.infer<TArkType> {
    const res = safeParse(val, type);
    return res.success;
}

export function isObjectType(
    schema: AnyTypeConstraint,
): schema is Type<{ readonly [key: string]: unknown }> {
    return tryCast(schema, Domain.Node)?.domain === 'object';
}
export function isArrayType(
    schema: AnyTypeConstraint,
): schema is Type<unknown[]> {
    throw new TypeError('TODO: not implemented');
    // Seems to come through as a weird looking intersection (Intersection.Node),
    // not sure why its not Sequence.Node
}

export function isUnionType(schema: AnyTypeConstraint): boolean {
    return tryCast(schema, Union.Node) !== undefined;
}

export function isNumberType(
    schema: AnyTypeConstraint,
): schema is Type<number> {
    return tryCast(schema, Domain.Node)?.domain === 'number';
}

export function isStringType(
    schema: AnyTypeConstraint,
): schema is Type<string> {
    return tryCast(schema, Domain.Node)?.domain === 'string';
}

export function isBooleanType(
    schema: AnyTypeConstraint,
): schema is Type<boolean> {
    return tryCast(schema, Union.Node)?.isBoolean ?? false;
}

export function isNumberLiteralType(schema: AnyTypeConstraint): boolean {
    return typeof tryCast(schema, Unit.Node)?.compiledValue === 'number';
}

export function isStringLiteralType(schema: AnyTypeConstraint): boolean {
    return typeof tryCast(schema, Unit.Node)?.compiledValue === 'string';
}

export function isBooleanLiteralType(schema: AnyTypeConstraint): boolean {
    return typeof tryCast(schema, Unit.Node)?.compiledValue === 'boolean';
}

export function isBooleanTrueLiteral(schema: AnyTypeConstraint): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === true;
}

export function isBooleanFalseLiteral(schema: AnyTypeConstraint): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === true;
}

export function isNullConstant(schema: AnyTypeConstraint): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === null;
}

export function isUndefinedConstant(schema: AnyTypeConstraint): boolean {
    return tryCast(schema, Unit.Node)?.compiledValue === undefined;
}

export function isLiteralType(schema: AnyTypeConstraint): boolean {
    return (
        isStringLiteralType(schema) ||
        isNumberLiteralType(schema) ||
        isBooleanLiteralType(schema) ||
        isNullConstant(schema) ||
        isUndefinedConstant(schema)
    );
}

export function isStringOrStringLiteralType(
    schema: AnyTypeConstraint,
): schema is Type<string> {
    return isStringType(schema) || isStringLiteralType(schema);
}

export function isNumberOrNumberLiteralType(
    schema: AnyTypeConstraint,
): schema is Type<number> {
    return isNumberType(schema) || isNumberLiteralType(schema);
}

export function isBooleanOrBooleanLiteralType(
    schema: AnyTypeConstraint,
): schema is Type<boolean> {
    return isBooleanType(schema) || isBooleanLiteralType(schema);
}

export function isUnknownType(schema: AnyTypeConstraint): boolean {
    throw new TypeError('TODO: not implemented');
    // Seems to come through as a weird looking intersection (Intersection.Node)
}
