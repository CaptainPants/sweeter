import { type, Type } from 'arktype';
import { BaseNode, Domain, Union, Unit } from '@ark/schema';

import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { safeParse } from '../../utility/parse.js';
import { Constructor } from '../../types.js';
import { LiteralType } from '../LiteralType.js';
import { UnionType } from '../UnionType.js';

export function is<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(val: unknown, type: TArkType): val is type.infer<TArkType> {
    const res = safeParse(val, type);
    return res.success;
}

function asClass<TNode extends BaseNode>(schema: arkTypeUtilityTypes.AnyTypeConstraint, NodeConstructor: Constructor<TNode>): TNode | undefined {
    if (schema instanceof NodeConstructor) {
        return schema;
    }
    return undefined;
}

export function isObjectType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<{ readonly [key: string]: unknown }> {
    return asClass(schema, Domain.Node)?.domain === 'object';
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
): schema is UnionType<unknown> {
    return asClass(schema, Union.Node) !== undefined;
}

export function isNumberType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<number> {
    return asClass(schema, Domain.Node)?.domain === 'number';
}

export function isStringType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<string> {
    return asClass(schema, Domain.Node)?.domain === 'string';
}

export function isBooleanType(schema: arkTypeUtilityTypes.AnyTypeConstraint): schema is Type<boolean> {
    return asClass(schema, Union.Node)?.isBoolean ?? false;
}

export function isNumberLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is LiteralType<number> {
    return typeof asClass(schema, Unit.Node)?.compiledValue === 'number';
}

export function isStringLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is LiteralType<string> {
    return typeof asClass(schema, Unit.Node)?.compiledValue === 'string';
}

export function isBooleanLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is LiteralType<boolean> {
    return typeof asClass(schema, Unit.Node)?.compiledValue === 'boolean';
}

export function isBooleanTrueLiteral(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is LiteralType<true> {
    return asClass(schema, Unit.Node)?.compiledValue === true;
}

export function isBooleanFalseLiteral(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is LiteralType<true> {
    return asClass(schema, Unit.Node)?.compiledValue === true;
}

export function isNullConstant(
    schema: arkTypeUtilityTypes.AnyTypeConstraint
): schema is LiteralType<null> {
    return asClass(schema, Unit.Node)?.compiledValue === null;
}

export function isUndefinedConstant(
    schema: arkTypeUtilityTypes.AnyTypeConstraint
): schema is LiteralType<undefined> {
    return asClass(schema, Unit.Node)?.compiledValue === undefined;
}

export function isLiteralType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is
    | LiteralType<string>
    | LiteralType<number>
    | LiteralType<true>
    | LiteralType<false> {
    return (
        isStringLiteralType(schema) ||
        isNumberLiteralType(schema) ||
        isBooleanLiteralType(schema)
    );
}

export function isConstantType(
    schema: arkTypeUtilityTypes.AnyTypeConstraint,
): schema is
    | LiteralType<string>
    | LiteralType<number>
    | LiteralType<true>
    | LiteralType<false>
    | LiteralType<null>
    | LiteralType<undefined> {
    return (
        isLiteralType(schema) || isNullConstant(schema) || isUndefinedConstant(schema)
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