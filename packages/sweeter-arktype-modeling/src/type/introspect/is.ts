import { BaseNode } from '@ark/schema';
import { type Type, type type } from 'arktype';

import { safeParse } from '../../utility/parse.js';
import { type AnyTypeConstraint } from '../types.js';

import {
    asDomainNode,
    asIntersectionNode,
    asUnionNode,
    asUnitNode,
} from './internal/arktypeInternals.js';

export function isType(value: unknown): value is Type<unknown> {
    return value instanceof BaseNode;
}

export function is<TSchema extends AnyTypeConstraint>(
    val: unknown,
    type: TSchema,
): val is type.infer<TSchema> {
    const res = safeParse(val, type);
    return res.success;
}

export function isObjectType(
    schema: AnyTypeConstraint,
): schema is Type<{ readonly [key: string]: unknown }> {
    return asIntersectionNode(schema as never)?.inner.domain?.domain === 'object';
}

export function isArrayType(
    schema: AnyTypeConstraint,
): schema is Type<unknown[]> {
    return asIntersectionNode(schema as never)?.inner.proto?.builtinName === 'Array';
}

export function isUnionType(schema: AnyTypeConstraint): boolean {
    return Boolean(asUnionNode(schema as never));
}

export function isNumberType(
    schema: AnyTypeConstraint,
): schema is Type<number> {
    return asDomainNode(schema as never)?.domain === 'number';
}

export function isStringType(
    schema: AnyTypeConstraint,
): schema is Type<string> {
    return asDomainNode(schema as never)?.domain === 'string';
}

export function isSymbolType(
    schema: AnyTypeConstraint,
): schema is Type<symbol> {
    return asDomainNode(schema as never)?.domain === 'symbol';
}

export function isBooleanType(
    schema: AnyTypeConstraint,
): schema is Type<boolean> {
    const typed = asUnionNode(schema as never);
    if (typed?.inner.branches) {
        const branches = typed.inner.branches;
        if (branches.length != 2) return false;

        const branch1 = asUnitNode(branches[0]!);
        const branch2 = asUnitNode(branches[1]!);

        if (!branch1 || !branch2) {
            return false;
        }

        const value1 = branch1.compiledValue;
        const value2 = branch2.compiledValue;

        return (
            typeof value1 === 'boolean' &&
            typeof value2 === 'boolean' &&
            value1 !== value2
        );
    }
    return false;
}

export function isNumberLiteralType(schema: AnyTypeConstraint): boolean {
    return asUnitNode(schema as never)?.domain === 'number';
}

export function isStringLiteralType(schema: AnyTypeConstraint): boolean {
    return asUnitNode(schema as never)?.domain === 'string';
}

export function isBooleanLiteralType(schema: AnyTypeConstraint): boolean {
    return asUnitNode(schema as never)?.domain === 'boolean';
}

export function isBooleanTrueLiteral(schema: AnyTypeConstraint): boolean {
    return asUnitNode(schema as never)?.unit === true;
}

export function isBooleanFalseLiteral(schema: AnyTypeConstraint): boolean {
    return asUnitNode(schema as never)?.unit === false;
}

export function isNullConstant(schema: AnyTypeConstraint): boolean {
    return asUnitNode(schema as never)?.unit === null;
}

export function isUndefinedConstant(schema: AnyTypeConstraint): boolean {
    const node = asUnitNode(schema as never);
    if (!node) return false;
    return node.unit === undefined;
}

export function isLiteralType(schema: AnyTypeConstraint): boolean {
    const node = asUnitNode(schema as never);
    return !!node;
}
export function isLiteralValue(
    schema: AnyTypeConstraint,
    value: unknown,
): boolean {
    const node = asUnitNode(schema as never);
    if (!node) return false;
    return node.unit === value;
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
