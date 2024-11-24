import { type, Type } from 'arktype';

import { safeParse } from '../../utility/parse.js';
import { type AnyTypeConstraint } from '../AnyTypeConstraint.js';
import { BaseNode } from '@ark/schema';
import { getDomainNode, getIntersectionNode, getProtoNode, getUnionNode, getUnitNode } from './internal/arktypeInternals.js';

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
    return getIntersectionNode(schema as never)?.domain?.domain === 'object';
}

export function isArrayType(
    schema: AnyTypeConstraint,
): schema is Type<unknown[]> {
    return getProtoNode(schema as never)?.builtinName === 'Array';
}

export function isUnionType(schema: AnyTypeConstraint): boolean {
    return !!getUnionNode(schema as never);
}

export function isNumberType(
    schema: AnyTypeConstraint,
): schema is Type<number> {
    return getDomainNode(schema as never)?.domain === 'number';
}

export function isStringType(
    schema: AnyTypeConstraint,
): schema is Type<string> {
    return getDomainNode(schema as never)?.domain === 'string';
}

export function isBooleanType(
    schema: AnyTypeConstraint,
): schema is Type<boolean> {
    const typed = getUnionNode(schema as never);
    if (typed?.inner.branches) {
        const branches = typed.inner.branches;
        if (branches.length != 2) return false;

        const branch1 = getUnitNode(branches[0]!);
        const branch2 = getUnitNode(branches[1]!);

        if (!branch1 || !branch2) {
            return false;
        }

        const value1 = branch1.compiledValue;
        const value2 = branch2.compiledValue;

        return typeof value1 === 'boolean' && typeof value2 === 'boolean' && value1 !== value2;
    }
    return false;
}

export function isNumberLiteralType(schema: AnyTypeConstraint): boolean {
    return getUnitNode(schema as never)?.domain === 'number';
}

export function isStringLiteralType(schema: AnyTypeConstraint): boolean {
    return getUnitNode(schema as never)?.domain === 'string';
}

export function isBooleanLiteralType(schema: AnyTypeConstraint): boolean {
    return getUnitNode(schema as never)?.domain === 'boolean';
}

export function isBooleanTrueLiteral(schema: AnyTypeConstraint): boolean {
    return getUnitNode(schema as never)?.compiledValue === true;
}

export function isBooleanFalseLiteral(schema: AnyTypeConstraint): boolean {
    return getUnitNode(schema as never)?.compiledValue === false;
}

export function isNullConstant(schema: AnyTypeConstraint): boolean {
    return getUnitNode(schema as never)?.compiledValue === null;
}

export function isUndefinedConstant(schema: AnyTypeConstraint): boolean {
    const node = getUnitNode(schema as never);
    if (!node) return false;
    return node.unit === undefined;
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
    const typed = schema as never as BaseNode;
    return typed.isUnknown();
}